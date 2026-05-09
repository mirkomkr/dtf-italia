import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";
import { CHECKOUT_ENABLED } from "@/lib/config";

export async function POST(request) {
  // ── CHECKOUT GATE ──────────────────────────────────────────────────────────
  // Se il checkout è disabilitato, blocca anche l'upload S3.
  // Impedisce accumulo di file orfani da utenti malintenzionati.
  if (!CHECKOUT_ENABLED) {
    return NextResponse.json(
      { error: "Il servizio è temporaneamente disattivato.", code: "CHECKOUT_DISABLED" },
      { status: 503 }
    );
  }
  // ── Fine gate ──────────────────────────────────────────────────────────────

  try {
    const { filename, contentType, orderId, cartItemId, position } =
      await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    // Mappa position → label leggibile per il path S3
    const positionLabels = {
      right: "lato-destro",
      heart: "lato-cuore",
      center: "al-centro",
      internal_label: "etichetta-interna",
      external_label: "etichetta-esterna",
      classic: "retro-classico",
      sleeve_right: "manica-destra",
      sleeve_left: "manica-sinistra",
    };

    const positionLabel =
      position && positionLabels[position]
        ? `-${positionLabels[position]}`
        : "";
    const sanitizedFilename = filename.replace(/\s+/g, "_");
    const timestamp = Date.now();

    /**
     * Gerarchia path S3:
     * 1. orderId   → uploads/orders/{orderId}/...              (recovery / sollecito esistente)
     * 2. cartItemId → uploads/cart/{cartItemId}/...             (file associato a prodotto nel carrello)
     * 3. fallback  → uploads/temp/...                          (lifecycle delete 24h — INVARIATO)
     */
    let key;
    if (orderId) {
      key = `uploads/orders/${orderId}/ordine-${orderId}-SOLLECITO${positionLabel}-${timestamp}-${sanitizedFilename}`;
    } else if (cartItemId) {
      key = `uploads/cart/${cartItemId}/${positionLabel ? positionLabel.slice(1) + "-" : ""}${timestamp}-${sanitizedFilename}`;
    } else {
      key = `uploads/temp/${timestamp}${positionLabel}-${sanitizedFilename}`;
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ success: true, url, key });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}

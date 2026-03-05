import { NextResponse } from "next/server";
import {
  createWooCommerceOrder,
  updateWooCommerceOrder,
} from "@/lib/woocommerce";
import { IS_DEV_MODE } from "@/lib/config";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "@/lib/s3-client";

export async function POST(request) {
  const bucket = S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

  try {
    const body = await request.json();
    console.log("ORDER REQUEST BODY:", JSON.stringify(body, null, 2));

    // ======================================================
    // BRANCH A: CARRELLO MULTI-ITEM (mode: 'cart')
    // ======================================================
    if (body.mode === "cart") {
      return await handleCartOrder(body, bucket);
    }

    // ======================================================
    // BRANCH B: ORDINE SINGOLO (legacy — backward compatible)
    // ======================================================
    return await handleSingleOrder(body, bucket);
  } catch (error) {
    console.error("ORDER API ERROR (FULL):", error);
    return NextResponse.json(
      {
        success: false,
        error: "Errore interno del server durante la creazione dell'ordine.",
        detail: error.message,
      },
      { status: 500 },
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// BRANCH A — Carrello multi-item
// ──────────────────────────────────────────────────────────────────────────────
async function handleCartOrder(body, bucket) {
  const {
    customer = {},
    cartItems = [], // Array di { type, cartItemId, fileKey, productData, pricing }
    shipping = {},
    paymentMethod,
    pricing = {},
    testOptions = { skipS3: false },
  } = body;

  if (cartItems.length === 0) {
    return NextResponse.json(
      { success: false, error: "Nessun prodotto nel carrello." },
      { status: 400 },
    );
  }

  const skipS3 = testOptions?.skipS3 ?? false;
  const createdOrderIds = [];

  // Creiamo un ordine WooCommerce per ogni item nel carrello
  for (const item of cartItems) {
    try {
      const orderId = await processSingleCartItem({
        item,
        customer,
        shipping,
        paymentMethod,
        pricing,
        skipS3,
        bucket,
      });
      createdOrderIds.push(orderId);
    } catch (err) {
      console.error(`Errore item ${item.cartItemId}:`, err.message);
      // Continuiamo con gli altri item ma logghiamo l'errore
    }
  }

  if (createdOrderIds.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Nessun ordine è stato creato. Controlla i dati e riprova.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    orderIds: createdOrderIds,
    orderId: createdOrderIds[0], // compatibility
  });
}

async function processSingleCartItem({
  item,
  customer,
  shipping,
  paymentMethod,
  pricing,
  skipS3,
  bucket,
}) {
  const { type, cartItemId, fileKey, productData, pricing: itemPricing } = item;

  // 1. Normalizza i fileKey
  const filesToProcess = {};
  if (fileKey && !skipS3) {
    if (typeof fileKey === "string") {
      filesToProcess.front = fileKey;
    } else if (typeof fileKey === "object") {
      for (const [pos, key] of Object.entries(fileKey)) {
        if (key) filesToProcess[pos] = key;
      }
    }
  }

  const hasFiles = Object.keys(filesToProcess).length > 0;

  // 2. Validazione file in S3 (HeadObject)
  if (hasFiles && !skipS3) {
    for (const [side, key] of Object.entries(filesToProcess)) {
      if (!key) continue;
      try {
        const checkKey = key.includes("uploads/")
          ? key
          : `uploads/cart/${cartItemId}/${key}`;
        await s3Client.send(
          new HeadObjectCommand({ Bucket: bucket, Key: checkKey }),
        );
      } catch (err) {
        throw new Error(
          `File ${side} non trovato su S3 per cartItemId ${cartItemId}. Riprova l'upload.`,
        );
      }
    }
  }

  // 3. Preparazione metadati WooCommerce
  const cfg = productData || {};
  const meta_data = [
    { key: "_configurator_type", value: type },
    { key: "_cart_item_id", value: cartItemId || "" },
    { key: "Tipo Prodotto", value: type },
    { key: "Quantità", value: String(cfg.totalQuantity || cfg.quantity || 1) },
    { key: "Formato", value: cfg.format || "N/D" },
    {
      key: "Dimensioni",
      value: cfg.width ? `${cfg.width}×${cfg.height}cm` : "N/D",
    },
    { key: "Stampa Fronte", value: cfg.frontPrint || "N/D" },
    { key: "Stampa Retro", value: cfg.backPrint || "N/D" },
    { key: "Tecnica", value: cfg.technique || "N/D" },
    {
      key: "Posizione Fronte",
      value: Array.isArray(cfg.frontPosition)
        ? cfg.frontPosition.join(", ")
        : cfg.frontPosition || "N/D",
    },
    {
      key: "Posizione Retro",
      value: Array.isArray(cfg.backPosition)
        ? cfg.backPosition.join(", ")
        : cfg.backPosition || "N/D",
    },
    {
      key: "Controllo File",
      value: cfg.fileCheck || cfg.isFullService ? "Sì" : "No",
    },
    { key: "Auto Outline", value: cfg.autoOutline ? "Sì" : "No" },
    { key: "Flash Order", value: cfg.isFlashOrder ? "Sì" : "No" },
    { key: "_file_uploaded_to_s3", value: hasFiles ? "yes" : "no" },
  ];

  for (const [side, fileKeyValue] of Object.entries(filesToProcess)) {
    if (fileKeyValue) {
      meta_data.push({
        key: `_s3_file_key_${side}`,
        value: fileKeyValue,
      });
    }
  }

  // 4. Creazione ordine WooCommerce
  const productId = type === "serigrafia" ? 240 : 488;
  const itemTotal = itemPricing?.totalPrice ?? 0;

  const orderData = {
    payment_method: paymentMethod === "dev" ? "bacs" : paymentMethod,
    set_paid:
      paymentMethod === "stripe" ||
      paymentMethod === "paypal" ||
      (paymentMethod === "dev" && IS_DEV_MODE),
    customer_note: customer?.notes || "",
    billing: {
      first_name: customer?.firstName || customer?.companyName || "Cliente",
      last_name: customer?.lastName || "",
      company: customer?.companyName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address_1: customer?.address || "",
      city: customer?.city || "",
      postcode: customer?.zip || "",
    },
    meta_data: [
      {
        key: "_billing_customer_type",
        value: customer?.customerType || "private",
      },
      { key: "_billing_codice_fiscale", value: customer?.codiceFiscale || "" },
      { key: "_billing_company_name", value: customer?.companyName || "" },
      { key: "_billing_partita_iva", value: customer?.partitaIva || "" },
      { key: "_billing_sdi_code", value: customer?.sdiCode || "" },
      { key: "_billing_pec", value: customer?.pec || "" },
      {
        key: "_billing_reference_person",
        value: customer?.referencePerson || "",
      },
      {
        key: "_billing_same_as_shipping",
        value: String(customer?.billingSameAsShipping ?? true),
      },
      { key: "_billing_address_alt", value: customer?.billingAddress || "" },
      { key: "_billing_city_alt", value: customer?.billingCity || "" },
      { key: "_billing_zip_alt",     value: customer?.billingZip || "" },
      // Chiavi critiche a livello ORDINE — accessibili via $order->get_meta() in PHP
      { key: "_configurator_type",   value: type },
      { key: "_file_uploaded_to_s3", value: hasFiles ? "yes" : "no" },
      { key: "_cart_item_id",        value: cartItemId || "" },
    ],
    line_items: [
      {
        product_id: productId,
        quantity: cfg.totalQuantity || cfg.quantity || 1,
        total: String(itemTotal.toFixed(2)),
        meta_data,
      },
    ],
    // Spedizione: solo sul primo item si aggiunge il costo fisso; per i successivi 0
    // (gestito nel frontend con un solo costo spedizione condiviso)
    shipping_lines: [
      {
        method_id:
          shipping?.option === "shipping" ? "flat_rate" : "local_pickup",
        method_title:
          shipping?.option === "shipping"
            ? "Spedizione Standard"
            : "Ritiro in sede",
        total: String((shipping?.cost ?? 0).toFixed(2)),
      },
    ],
  };

  const wcResponse = await createWooCommerceOrder(orderData);
  const orderId = wcResponse?.id;
  if (!orderId) throw new Error("ID ordine WooCommerce non ricevuto.");

  // 5. Spostamento S3: uploads/cart/{cartItemId}/ → uploads/orders/{orderId}/{type}-{cartItemId}/
  const movedFiles = [];
  const finalKeys = {};

  if (hasFiles && !skipS3) {
    try {
      for (const [side, originalKey] of Object.entries(filesToProcess)) {
        if (!originalKey) continue;

        const sourceKey = originalKey.includes("uploads/")
          ? originalKey
          : `uploads/cart/${cartItemId}/${originalKey}`;
        const rawFileName = originalKey
          .split("/")
          .pop()
          .replace(/^[0-9]+-/, "");
        const newKey = `uploads/orders/${orderId}/${type}-${cartItemId}/${side}-${rawFileName}`;

        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: encodeURI(`${bucket}/${sourceKey}`),
            Key: newKey,
          }),
        );

        movedFiles.push({ newKey, sourceKey });
        finalKeys[side] = newKey;

        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: sourceKey }),
        );
      }

      // Aggiorna WC con path definitivi — tutti i lati/posizioni
      const updateMeta = [];

      for (const [side, newKey] of Object.entries(finalKeys)) {
        if (newKey) {
          updateMeta.push({ key: `_s3_file_key_${side}`, value: newKey });
        }
      }

      // Alias retrocompatibili per lo snippet PHP e ordini DTF legacy
      const frontKey = finalKeys.front ?? finalKeys.center ?? null;
      const backKey = finalKeys.back ?? finalKeys.classic ?? null;
      if (frontKey) {
        updateMeta.push({ key: "_s3_file_key_front", value: frontKey });
        updateMeta.push({ key: "_s3_file_key", value: frontKey }); // legacy
      }
      if (backKey) {
        updateMeta.push({ key: "_s3_file_key_back", value: backKey });
      }

      await updateWooCommerceOrder(orderId, { meta_data: updateMeta });
    } catch (moveError) {
      console.error(
        `S3 MOVE ERROR ordine ${orderId} item ${cartItemId}:`,
        moveError,
      );
      // Rollback parziale
      for (const moved of movedFiles) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: moved.newKey }),
          );
        } catch {}
      }
      // Non blocchiamo: l'ordine esiste, logghiamo il problema file
      await updateWooCommerceOrder(orderId, {
        meta_data: [{ key: "_s3_move_error", value: moveError.message }],
      });
    }
  }

  return orderId;
}

// ──────────────────────────────────────────────────────────────────────────────
// BRANCH B — Ordine singolo legacy (invariato per backward compatibility)
// ──────────────────────────────────────────────────────────────────────────────
async function handleSingleOrder(body, bucket) {
  const {
    type = "dtf",
    customer = {},
    items = {},
    pricing = { totalPrice: 0 },
    uploadedFileKey = null,
    testOptions = { skipS3: false },
  } = body;

  // --- 1. NORMALIZZAZIONE FILE INPUT ---
  const filesToProcess = {};
  if (uploadedFileKey) {
    if (typeof uploadedFileKey === "string") {
      filesToProcess.front = uploadedFileKey;
    } else if (Array.isArray(uploadedFileKey) && uploadedFileKey.length > 0) {
      filesToProcess.front =
        uploadedFileKey[0].key || uploadedFileKey[0].s3Key || "";
    } else if (typeof uploadedFileKey === "object") {
      if (uploadedFileKey.front) filesToProcess.front = uploadedFileKey.front;
      if (uploadedFileKey.back) filesToProcess.back = uploadedFileKey.back;
    }
  }

  const hasFiles = Object.keys(filesToProcess).length > 0;

  // --- 2. VALIDAZIONE HEAD OBJECT ---
  if (hasFiles && !testOptions?.skipS3) {
    for (const [keyType, fileKey] of Object.entries(filesToProcess)) {
      if (!fileKey) continue;
      try {
        const checkKey = fileKey.includes("uploads/")
          ? fileKey
          : `uploads/temp/${fileKey}`;
        await s3Client.send(
          new HeadObjectCommand({ Bucket: bucket, Key: checkKey }),
        );
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${keyType} non trovato o scaduto. Riprova l'upload.`,
          },
          { status: 400 },
        );
      }
    }
  }

  // --- 3. ESTRAZIONE DATI ---
  const metersValue =
    items?.price?.details?.totalMeters || items?.meters || "0";
  let safeDetailedQuantities = "N/D";
  try {
    const q = items?.quantities || items?.detailedQuantities || {};
    safeDetailedQuantities =
      Object.keys(q).length > 0 ? JSON.stringify(q) : "N/D";
  } catch (e) {}

  // --- 4. META DATA ---
  const meta_data = [
    {
      key: "Front Print",
      value: items?.frontPrint || (type === "dtf" ? "Stampa DTF" : "N/D"),
    },
    { key: "Back Print", value: items?.backPrint || "N/D" },
    {
      key: "Technique",
      value:
        items?.technique ||
        (type === "serigrafia" ? "Serigrafia (Standard)" : "N/D"),
    },
    { key: "Format", value: items?.format || "Personalizzato" },
    {
      key: "Dimensions",
      value: items?.width
        ? `${items.width}x${items.height}cm`
        : items?.dimensions || "N/D",
    },
    { key: "Detailed Quantities", value: safeDetailedQuantities },
    { key: "Meters", value: String(metersValue) },
    {
      key: "Full Service",
      value:
        items?.isFullService ||
        items?.fileCheck ||
        items?.isProCheck ||
        items?.proCheck
          ? "Si"
          : "No",
    },
    { key: "Flash Order", value: items?.isFlashOrder ? "Si" : "No" },
    {
      key: "is_pro_check",
      value:
        items?.isFullService ||
        items?.fileCheck ||
        items?.isProCheck ||
        items?.proCheck
          ? "true"
          : "false",
    },
    { key: "is_auto_outline", value: items?.autoOutline ? "true" : "false" },
    { key: "is_flash_order", value: items?.isFlashOrder ? "true" : "false" },
    { key: "_file_uploaded_to_s3", value: hasFiles ? "yes" : "no" },
    { key: "_configurator_type", value: type },
  ];

  if (filesToProcess.front)
    meta_data.push({ key: "_s3_file_key_front", value: filesToProcess.front });
  if (filesToProcess.back)
    meta_data.push({ key: "_s3_file_key_back", value: filesToProcess.back });

  // --- 5. ORDINE WOOCOMMERCE ---
  const orderData = {
    payment_method: body.paymentMethod === "dev" ? "bacs" : body.paymentMethod,
    set_paid:
      body.paymentMethod === "stripe" ||
      body.paymentMethod === "paypal" ||
      (body.paymentMethod === "dev" && IS_DEV_MODE),
    customer_note: customer?.notes || "",
    billing: {
      first_name: customer?.firstName || customer?.companyName || "Cliente",
      last_name: customer?.lastName || "",
      company: customer?.companyName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address_1: customer?.address || "",
      city: customer?.city || "",
      postcode: customer?.zip || "",
    },
    meta_data: [
      {
        key: "_billing_customer_type",
        value: customer?.customerType || "private",
      },
      { key: "_billing_codice_fiscale", value: customer?.codiceFiscale || "" },
      { key: "_billing_company_name", value: customer?.companyName || "" },
      { key: "_billing_partita_iva", value: customer?.partitaIva || "" },
      { key: "_billing_sdi_code", value: customer?.sdiCode || "" },
      { key: "_billing_pec", value: customer?.pec || "" },
      {
        key: "_billing_reference_person",
        value: customer?.referencePerson || "",
      },
      {
        key: "_billing_same_as_shipping",
        value: String(customer?.billingSameAsShipping ?? true),
      },
      { key: "_billing_address_alt", value: customer?.billingAddress || "" },
      { key: "_billing_city_alt", value: customer?.billingCity || "" },
      { key: "_billing_zip_alt", value: customer?.billingZip || "" },
    ],
    line_items: [
      {
        product_id: items?.productId || (type === "serigrafia" ? 240 : 488),
        quantity: items?.totalQuantity || items?.quantity || 1,
        total: String(pricing?.finalTotal || pricing?.totalPrice || "0.00"),
        meta_data,
      },
    ],
  };

  const wcResponse = await createWooCommerceOrder(orderData);
  const orderId = wcResponse?.id;
  if (!orderId) throw new Error("ID ordine WooCommerce non ricevuto.");

  // --- 6. SPOSTAMENTO S3 ---
  const movedFiles = [];
  const finalKeys = {};

  if (hasFiles && !testOptions?.skipS3) {
    try {
      for (const [keyType, originalKey] of Object.entries(filesToProcess)) {
        if (!originalKey) continue;
        const sourceKey = originalKey.includes("uploads/")
          ? originalKey
          : `uploads/temp/${originalKey}`;
        const rawFileName = originalKey.split("/").pop();
        const cleanName = rawFileName.replace(/^[0-9]+-/, "");
        const suffix = keyType === "front" ? "FRONTE" : "RETRO";
        const newKey = `uploads/orders/${orderId}/ordine-${orderId}-${suffix}-${cleanName}`;

        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: encodeURI(`${bucket}/${sourceKey}`),
            Key: newKey,
          }),
        );
        movedFiles.push({ newKey, sourceKey });
        finalKeys[keyType] = newKey;
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: bucket, Key: sourceKey }),
        );
      }

      const updateMeta = [];
      if (finalKeys.front)
        updateMeta.push({ key: "_s3_file_key_front", value: finalKeys.front });
      if (finalKeys.back)
        updateMeta.push({ key: "_s3_file_key_back", value: finalKeys.back });
      if (finalKeys.front)
        updateMeta.push({ key: "_s3_file_key", value: finalKeys.front });
      await updateWooCommerceOrder(orderId, { meta_data: updateMeta });
    } catch (moveError) {
      console.error("ERRORE SPOSTAMENTO S3 (ROLLBACK AVVIATO):", moveError);
      for (const moved of movedFiles) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: moved.newKey }),
          );
        } catch {}
      }
      return NextResponse.json(
        {
          success: false,
          orderId,
          error:
            "Errore durante il salvataggio dei file. L'ordine è stato creato ma i file non sono stati allegati correttamente.",
          detail: moveError.message,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true, orderId });
}

import { NextResponse } from 'next/server';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '@/lib/s3-client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { filename, contentType, orderId } = body;

    // 1. Controllo rigoroso: filename deve esistere ed essere una stringa
    if (!filename || typeof filename !== 'string') {
      console.error("Errore: filename mancante o formato non valido", { filename });
      return NextResponse.json({ error: 'Nome file non valido o mancante' }, { status: 400 });
    }

    // 2. Pulizia del nome file (sicura perché ora sappiamo che è una stringa)
    const safeFilename = filename.replace(/\s+/g, '_');
    const timestamp = Date.now();

    // 3. Generazione Key con la nuova struttura cartelle
    const key = orderId 
      ? `uploads/orders/${orderId}/${timestamp}-${safeFilename}`
      : `uploads/temp/${timestamp}-${safeFilename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({
      success: true,
      url,
      key
    });

  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL', details: error.message },
      { status: 500 }
    );
  }
}
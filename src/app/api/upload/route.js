import { NextResponse } from 'next/server';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '@/lib/s3-client';

export async function POST(request) {
  try {
    const { filename, contentType, orderId, position } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    // Map position IDs to readable labels
    const positionLabels = {
      'right': 'lato-destro',
      'heart': 'lato-cuore',
      'center': 'al-centro',
      'internal_label': 'etichetta-interna',
      'external_label': 'etichetta-esterna',
      'classic': 'retro-classico'
    };

    const positionLabel = position && positionLabels[position] ? `-${positionLabels[position]}` : '';
    const sanitizedFilename = filename.replace(/\s+/g, '_');

    const key = orderId 
      ? `uploads/orders/${orderId}/ordine-${orderId}-SOLLECITO${positionLabel}-${Date.now()}-${sanitizedFilename}`
      : `uploads/temp/${Date.now()}${positionLabel}-${sanitizedFilename}`;
    
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
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

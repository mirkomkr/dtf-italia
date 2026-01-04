import { NextResponse } from 'next/server';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from '@/lib/s3-client';

export async function POST(request) {
  try {
    const { filename, contentType, orderId } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    const key = orderId 
  ? `uploads/orders/${orderId}/${Date.now()}-${filename.replace(/\s+/g, '_')}`
  : `uploads/temp/${Date.now()}-${filename.replace(/\s+/g, '_')}`;
    
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

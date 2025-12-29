import { NextResponse } from 'next/server';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3-client";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    try {
        const bucketName = process.env.S3_BUCKET_NAME;
        
        if (!bucketName) {
            console.error("S3_BUCKET_NAME is not defined in env");
             return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
        });

        // Create a signed URL that expires in 1 hour (3600 seconds)
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Redirect the user to the temporary secure link
        return NextResponse.redirect(signedUrl);

    } catch (error) {
        console.error("Error generating signed download URL:", error);
        return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
    }
}

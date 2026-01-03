import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    console.warn("Missing S3 Environment Variables. Uploads may fail.");
}

export const S3_REGION = process.env.S3_REGION || "eu-south-1";
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

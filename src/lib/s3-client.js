import { S3Client } from "@aws-sdk/client-s3";

// Log di controllo (lo vedrai nei log di Vercel)
console.log("S3 Config Check:", {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET_NAME,
    hasAccessKey: !!process.env.S3_ACCESS_KEY,
    hasSecretKey: !!process.env.S3_SECRET_KEY
});

if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY || !process.env.S3_BUCKET_NAME) {
    console.error("ERRORE: Variabili S3 mancanti! Controlla Vercel Dashboard.");
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
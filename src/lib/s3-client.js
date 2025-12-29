import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.S3_REGION || !process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
    console.warn("Missing S3 Environment Variables. Uploads may fail.");
}

export const s3Client = new S3Client({
  region: process.env.S3_REGION || "eu-south-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

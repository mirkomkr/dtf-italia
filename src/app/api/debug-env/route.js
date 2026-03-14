import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  return NextResponse.json({
    hasRevalSecret: !!process.env.REVALIDATE_SECRET,
    hasWebhookSecret: !!process.env.WEBHOOK_SECRET,
    revalSecretLength: process.env.REVALIDATE_SECRET ? process.env.REVALIDATE_SECRET.length : 0,
    webhookSecretLength: process.env.WEBHOOK_SECRET ? process.env.WEBHOOK_SECRET.length : 0,
    revalSecretFirst3: process.env.REVALIDATE_SECRET ? process.env.REVALIDATE_SECRET.substring(0, 3) : null,
    revalSecretLast3: process.env.REVALIDATE_SECRET ? process.env.REVALIDATE_SECRET.substring(process.env.REVALIDATE_SECRET.length - 3) : null
  });
}

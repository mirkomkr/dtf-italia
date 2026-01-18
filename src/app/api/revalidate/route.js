import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRevalidation(request) {
  const secret = request.nextUrl.searchParams.get('secret');
  const envSecret = process.env.REVALIDATE_SECRET;

  console.log('--- Revalidate Debug ---');
  console.log('Received secret (param):', secret);
  console.log('Env secret length:', envSecret ? envSecret.length : 'NOT SET');
  
  if (!envSecret) {
    console.error('REVALIDATE_SECRET is not set in environment variables.');
    return NextResponse.json({ message: 'Server configuration error: REVALIDATE_SECRET missing' }, { status: 500 });
  }

  if (secret !== envSecret) {
    // TEMPORARY DEBUG: Return hint about mismatch
    return NextResponse.json({ 
      message: 'Invalid token',
      debug: {
        received: secret ? `${secret.substring(0,3)}... (len: ${secret.length})` : 'null',
        expected: `${envSecret.substring(0,3)}... (len: ${envSecret.length})`,
        match: secret === envSecret
      }
    }, { status: 401 });
  }

  try {
    revalidateTag('products');
    console.log('Revalidation successful for tag: products');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return handleRevalidation(request);
}

export async function POST(request) {
  return handleRevalidation(request);
}

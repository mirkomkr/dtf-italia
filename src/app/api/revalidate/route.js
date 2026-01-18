import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRevalidation(request) {
  const secret = request.nextUrl.searchParams.get('secret');
  const envSecret = process.env.REVALIDATE_SECRET;

  console.log('--- Revalidate Debug ---');
  console.log('Full URL:', request.url);
  console.log('Received secret (param):', secret);
  
  if (!envSecret) {
    return NextResponse.json({ message: 'Server configuration error: REVALIDATE_SECRET missing' }, { status: 500 });
  }

  if (secret !== envSecret) {
    return NextResponse.json({ 
      message: 'Invalid token',
      debug: {
        url: request.url, // Vediamo l'URL completo che arriva al server
        received: secret ? `${secret.substring(0,3)}...` : 'null',
        expected_len: envSecret.length,
        match: false
      }
    }, { status: 401 });
  }

  try {
    revalidateTag('products');
    console.log('Revalidation successful for tag: products');
    // REMOVE DEBUG IN PROD: But keep simple success for now
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

import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRevalidation(request) {
  const secret = request.nextUrl.searchParams.get('secret');
  const envSecret = process.env.REVALIDATE_SECRET;

  if (!envSecret) {
    console.error('REVALIDATE_SECRET is not set in environment variables.');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  if (secret !== envSecret) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    revalidateTag('products');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return handleRevalidation(request);
}

export async function POST(request) {
  return handleRevalidation(request);
}

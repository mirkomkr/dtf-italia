import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * WooCommerce Webhook Handler
 * 
 * Automatically revalidates cache when products are updated in WooCommerce.
 * 
 * Security: HMAC-SHA256 signature verification
 * Revalidation: Granular tags (product:{slug}, category:{slug})
 * 
 * @see https://woocommerce.github.io/woocommerce-rest-api-docs/#webhooks
 */

/**
 * Verify WooCommerce webhook signature
 * 
 * @param {Request} request - Next.js request object
 * @param {string} rawBody - Raw request body
 * @returns {boolean} True if signature is valid
 */
function verifySignature(request, rawBody) {
  const signature = request.headers.get('x-wc-webhook-signature');
  const secret = process.env.WEBHOOK_SECRET || process.env.REVALIDATE_SECRET;

  if (!signature || !secret) {
    return false;
  }

  // Generate expected signature using HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  return signature === expectedSignature;
}

/**
 * Extract revalidation tags from WooCommerce product payload
 * 
 * @param {Object} payload - WooCommerce product payload
 * @returns {Array<string>} Array of cache tags to revalidate
 */
function extractTags(payload) {
  const tags = [];

  // Add product-specific tag
  if (payload.slug) {
    tags.push(`product:${payload.slug}`);
  }

  // Add category-specific tags
  if (payload.categories && Array.isArray(payload.categories)) {
    payload.categories.forEach(category => {
      if (category.slug) {
        tags.push(`category:${category.slug}`);
      }
    });
  }

  return tags;
}

/**
 * POST handler for WooCommerce webhooks
 */
export async function POST(request) {
  const startTime = Date.now();

  try {
    // 1. Read raw body for signature verification
    const rawBody = await request.text();
    
    // 2. Verify HMAC signature (security)
    if (!verifySignature(request, rawBody)) {
      console.error('[Webhook] Invalid signature', {
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });
      
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('[Webhook] Invalid JSON payload', {
        error: parseError.message,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // 4. Validate required fields
    if (!payload.id || !payload.slug) {
      console.error('[Webhook] Missing required fields', {
        payload: { id: payload.id, slug: payload.slug },
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: 'Missing required fields: id, slug' },
        { status: 400 }
      );
    }

    // 5. Only revalidate published products
    if (payload.status !== 'publish') {
      console.log('[Webhook] Skipping non-published product', {
        productId: payload.id,
        slug: payload.slug,
        status: payload.status,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: 'Product not published'
      });
    }

    // 6. Extract tags from payload
    const tags = extractTags(payload);

    if (tags.length === 0) {
      console.warn('[Webhook] No tags extracted from payload', {
        productId: payload.id,
        slug: payload.slug,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: 'No tags to revalidate' },
        { status: 400 }
      );
    }

    // 7. Revalidate cache for each tag
    tags.forEach(tag => {
      revalidateTag(tag);
    });

    // 8. Log success
    const duration = Date.now() - startTime;
    console.log('[Webhook] Cache revalidated successfully', {
      event: 'product.updated',
      productId: payload.id,
      productName: payload.name,
      slug: payload.slug,
      tags: tags,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    // 9. Return success response
    return NextResponse.json({
      success: true,
      productId: payload.id,
      slug: payload.slug,
      tags: tags,
      revalidated: tags.length,
      duration: `${duration}ms`
    });

  } catch (error) {
    // Catch-all error handler
    console.error('[Webhook] Unexpected error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for documentation/testing
 */
export async function GET() {
  return NextResponse.json({
    name: 'WooCommerce Webhook Handler',
    version: '1.0.0',
    description: 'Automatically revalidates Next.js cache when WooCommerce products are updated',
    usage: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WC-Webhook-Signature': 'HMAC-SHA256 signature'
      },
      payload: {
        id: 123,
        slug: 'product-slug',
        status: 'publish',
        categories: [
          { slug: 'category-slug' }
        ]
      }
    },
    configuration: {
      woocommerce: {
        topic: 'Product updated',
        delivery_url: 'https://dtfitalia.it/api/webhook/woocommerce',
        secret: 'Use WEBHOOK_SECRET or REVALIDATE_SECRET from .env',
        api_version: 'WP REST API Integration v3'
      }
    },
    security: {
      signature_verification: 'HMAC-SHA256',
      header: 'X-WC-Webhook-Signature'
    },
    revalidation: {
      strategy: 'Granular tags',
      tags: [
        'product:{slug}',
        'category:{category-slug}'
      ]
    }
  });
}

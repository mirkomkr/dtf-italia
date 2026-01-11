import { cache } from 'react';

const baseUrl = process.env.WORDPRESS_URL;
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

// 1. In-memory cache for Category Slug -> ID resolution
const CATEGORY_ID_CACHE = new Map();

/**
 * Helper to perform authenticated WooCommerce fetch with Next.js caching options.
 */
/**
 * Helper to perform authenticated WooCommerce fetch with Next.js caching options.
 */
async function fetchWooCommerce(endpoint, params = {}, options = {}) {
  const url = new URL(`${baseUrl}/wp-json/wc/v3/${endpoint}`);
  
  // If GET, append params to URL. If POST/PUT, params might be body (handled below but usually separate args desirable)
  // For compat with existing getWooCommerceProducts, we assume params are query params if method is GET (default).
  const method = options.method || 'GET';

  if (method === 'GET') {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
  }

const authHeader = `Basic ${btoa(`${consumerKey}:${consumerSecret}`)}`;

  // Dev mode: reduce revalidation time to see changes faster, or use 0 to disable.
  // Prod mode: default 3600 (1 hour). Can be overridden via options.revalidate.
  const isDev = process.env.NODE_ENV === 'development';
const defaultRevalidate = process.env.NODE_ENV === 'development' ? 30 : 86400;
const revalidateTime = options.revalidate !== undefined ? options.revalidate : defaultRevalidate;

const fetchOptions = {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    next: { 
      revalidate: revalidateTime,
      tags: ['products'] 
    },
  };

  if (method !== 'GET' && options.body) {
      fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url.toString(), fetchOptions);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "N/A");
    console.error(`WooCommerce API Error Details:`, errorText);
    throw new Error(`WooCommerce API Error: ${res.status} ${res.statusText}`);
  }

  // Cloniamo la risposta per poterla leggere due volte se necessario
  const resClone = res.clone();

  try {
      return await res.json();
  } catch (parseError) {
      const bodySnippet = await resClone.text().catch(() => "Unable to read body");
      console.error("FAILED TO PARSE WOOCOMMERCE JSON. Response body snippet:", bodySnippet.substring(0, 800));
      throw new Error(`WooCommerce returned invalid JSON (HTML?). Snippet: ${bodySnippet.substring(0, 300)}...`);
  }
}

/**
 * Update a WooCommerce Order
 */
export async function updateWooCommerceOrder(orderId, data) {
    return await fetchWooCommerce(`orders/${orderId}`, {}, {
        method: 'PUT',
        body: data,
        revalidate: 0
    });
}

/**
 * Create a WooCommerce Order
 */
export async function createWooCommerceOrder(data) {
    return await fetchWooCommerce(`orders`, {}, {
        method: 'POST',
        body: data,
        revalidate: 0
    });
}

/**
 * Fetch products from WooCommerce API.
 * Optimized with React cache (Request Memoization), Data Cache, and In-Memory Category Cache.
 */
export const getWooCommerceProducts = cache(async ({ perPage = 50, category, slug, revalidate } = {}) => {
  try {
    let categoryId = null;

    // Resolve category filter (slug) to ID
    if (category) {
      if (CATEGORY_ID_CACHE.has(category)) {
        categoryId = CATEGORY_ID_CACHE.get(category);
      } else {
        // Fetch category ID if not in memory
        const categories = await fetchWooCommerce("products/categories", { slug: category }, { revalidate });
        
        if (categories && categories.length > 0) {
          categoryId = categories[0].id;
          CATEGORY_ID_CACHE.set(category, categoryId);
        } else {
          // Category not found
          return [];
        }
      }
    }

    const params = {
      per_page: perPage,
      slug,
    };

    if (categoryId) {
      params.category = categoryId;
    }

    const data = await fetchWooCommerce("products", params, { revalidate });
    
    // Map data to reduce payload size and improve TBT
return data.map(product => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  price: product.price,
  // Puliamo la descrizione: rimuoviamo tag script e stili se presenti
description: product.description
  ? product.description
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "")
      .replace(/<![\s\S]*?--[ \t\n\r]*>/g, "") // Versione ultra-compatibile per i commenti HTML
      .trim()
  : "",
  short_description: product.short_description,
  sku: product.sku,
  images: product.images?.map(img => ({
    src: img.src,
    alt: img.alt || product.name
  })) || []
}));
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error.message);
    return [];
  }
});

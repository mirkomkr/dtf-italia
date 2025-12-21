import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

/**
 * Fetch products from WooCommerce API.
 * Supports resolving category slug to ID first.
 */
export async function getWooCommerceProducts({ perPage = 50, category, slug } = {}) {
  try {
    let categoryId = null;

    // Resolve category filter (slug) to ID
    if (category) {
      const { data: categories } = await api.get("products/categories", {
        slug: category,
      });

      if (categories && categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        // Category not found, return empty array immediately
        return [];
      }
    }

    const params = {
      per_page: perPage,
      slug,
    };

    if (categoryId) {
      params.category = categoryId;
    }

    const { data } = await api.get("products", params);
    return data;
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error.message);
    // Return empty array on error to safely handle UI 
    return [];
  }
}

// app/api/product/woocommerce/route.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { NextResponse } from "next/server";

const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get("perPage") ?? 50;
  const category = searchParams.get("category"); 
  const slug = searchParams.get("slug");

  if (!category && !slug) {
    return NextResponse.json(
      { success: false, error: "Missing filters" },
      { status: 400 }
    );
  }

  try {
    let categoryId = null;

    // Se c'è un filtro categoria (che è uno slug lato client), dobbiamo trovare l'ID
    if (category) {
      const { data: categories } = await api.get("products/categories", {
        slug: category,
      });

      if (categories && categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        // Se la categoria non esiste, ritorniamo array vuoto subito
        return NextResponse.json({ success: true, products: [] });
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

    return NextResponse.json({ success: true, products: data });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

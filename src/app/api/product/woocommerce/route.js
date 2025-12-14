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

  try {
    const { data } = await api.get("products", {
      per_page: perPage,
      category: category,
    });

    return NextResponse.json({
      success: true,
      products: data,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

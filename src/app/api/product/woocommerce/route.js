import { NextResponse } from "next/server";
import { getWooCommerceProducts } from "@/lib/woocommerce";

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
    const products = await getWooCommerceProducts({ perPage, category, slug });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize WooCommerce API
const api = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    
    // Extract Data
    const file = formData.get("file");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const address = formData.get("address");
    const city = formData.get("city");
    const zip = formData.get("zip");
    const shippingOption = formData.get("shippingOption");
    
    const color = formData.get("color");
    const sizes = formData.get("sizes"); // JSON string
    const frontPrint = formData.get("frontPrint");
    const backPrint = formData.get("backPrint");
    const fileCheck = formData.get("fileCheck") === 'true';
    
    const totalPrice = parseFloat(formData.get("totalPrice"));
    const unitPrice = parseFloat(formData.get("unitPrice"));
    const totalQuantity = parseInt(formData.get("totalQuantity"));
    const shippingCost = parseFloat(formData.get("shippingCost"));
    const productId = formData.get("productId") ? parseInt(formData.get("productId")) : 0;

    // 1. Handle File Upload
    let fileUrl = "";
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      // Create a unique filename to avoid collisions
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-');
      const arrayBuffer = await file.arrayBuffer();
      
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(arrayBuffer));
      
      // Construct URL (assuming standard Next.js public folder serving)
      const host = req.headers.get("host");
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      fileUrl = `${protocol}://${host}/uploads/${filename}`;
    }

    // 2. Prepare Meta Data for the Line Item
    const metaData = [
      { key: "Colore T-Shirt", value: color || "N/A" },
      { key: "Taglie", value: parseSizes(sizes) },
      { key: "Stampa Fronte", value: frontPrint },
      { key: "Stampa Retro", value: backPrint },
      { key: "File Grafica", value: fileUrl || "Nessun file caricato" },
      { key: "Verifica File", value: fileCheck ? "Sì" : "No" }
    ];

    // 3. Construct Order Object
    const orderData = {
      payment_method: "bacs", // Default to bank transfer or handled externally via checkout flow
      payment_method_title: "Bonifico Bancario / Checkout",
      set_paid: false,
      status: "processing",
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        address_1: address,
        city: city,
        postcode: zip,
        country: "IT",
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        postcode: zip,
        country: "IT",
      },
      line_items: [
        {
          name: "Servizio Serigrafia Personalizzata",
          product_id: productId > 0 ? productId : undefined,
          quantity: totalQuantity,
          price: String(unitPrice), // WooCommerce expects string for price
          total: String(totalPrice), // Total line total
          meta_data: metaData
        },
      ],
      shipping_lines: shippingOption === 'shipping' ? [
        {
          method_id: "flat_rate",
          method_title: "Spedizione Standard",
          total: String(shippingCost)
        }
      ] : [],
      customer_note: "Ordine generato dal Configuratore Serigrafia"
    };

    // 4. Create Order in WooCommerce
    const response = await api.post("orders", orderData);

    if (response.status === 201) {
       return NextResponse.json({ success: true, orderId: response.data.id, redirectUrl: `/checkout/success?order=${response.data.id}` }); 
    } else {
       throw new Error(`WooCommerce Error: ${response.statusText}`);
    }

  } catch (err) {
    console.error("Order Creation Error:", err);
    const details = err.response?.data || {};
    return NextResponse.json({ success: false, error: err.message, details }, { status: 500 });
  }
};

// Helper to format sizes string
function parseSizes(sizesJson) {
  try {
    const sizes = JSON.parse(sizesJson);
    return Object.entries(sizes)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${qty}x ${size}`)
      .join(", ");
  } catch (e) {
    return sizesJson;
  }
}

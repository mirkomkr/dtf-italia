import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const color = formData.get("color");
    const size = formData.get("size");
    const quantity = formData.get("quantity");
    const position = formData.get("position");
    const numColors = formData.get("numColors");
    const file = formData.get("file");

    // Salva il file in /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(path.join(uploadsDir, file.name), Buffer.from(arrayBuffer));

    // Qui puoi chiamare l'API WooCommerce per creare ordine e allegare meta
    // es: line_items con product_id Felpa + meta: colore, taglia, quantità, posizione, numColors, file_url

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
};

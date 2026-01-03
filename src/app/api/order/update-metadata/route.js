import { NextResponse } from 'next/server';
import { updateWooCommerceOrder } from '@/lib/woocommerce';

export async function POST(request) {
    try {
        const { orderId, metaData } = await request.json();

        if (!orderId || !metaData) {
            return NextResponse.json({ success: false, error: "ID Ordine o Metadati mancanti" }, { status: 400 });
        }

        // Convert key-value object to WooCommerce meta_data array format
        const meta_data = Object.entries(metaData).map(([key, value]) => ({
            key,
            value
        }));

        const response = await updateWooCommerceOrder(orderId, { meta_data });

        return NextResponse.json({ 
            success: true, 
            woocommerce_id: response.id 
        });

    } catch (error) {
        console.error("Error updating WooCommerce metadata:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

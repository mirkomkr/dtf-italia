import { NextResponse } from 'next/server';
import { updateWooCommerceOrder } from '@/lib/woocommerce';

export async function POST(request) {
    try {
        const { orderId, s3Key } = await request.json();

        if (!orderId || !s3Key) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        console.log(`Syncing S3 Key for Order #${orderId}: ${s3Key}`);

        // Update WooCommerce Order Metadata
        // We append to meta_data. 
        // Note: 'meta_data' in WC API is an array of objects { key, value }.
        // We use a specific key '_s3_file_key' (underscore usually hidden in admin, but useful for dev. 
        // Or 's3_file_url' if we want it visible).
        
        const response = await updateWooCommerceOrder(orderId, {
            meta_data: [
                {
                    key: '_s3_file_key',
                    value: s3Key
                },
                {
                    key: 's3_download_url', // Visible custom field
                    value: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`
                }
            ]
        });

        return NextResponse.json({ 
            success: true, 
            woocommerce_id: response.id 
        });

    } catch (error) {
        console.error("Error updating WooCommerce order:", error);
        // We don't want to break the UI flow if this background sync fails, 
        // but we should log it.
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

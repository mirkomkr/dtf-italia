import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
    const bucket = S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

    try {
        const body = await request.json();
        console.log("INCOMING BODY:", JSON.stringify(body)); // Fondamentale per il debug

        const { 
            customer = {}, 
            shipping = { option: 'pickup', cost: 0 }, 
            paymentMethod = 'bacs', 
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            testOptions = { skipS3: false }
        } = body;

        // --- FIX CRITICO: Trasforma uploadedFileKey in stringa sicura ---
        let safeKey = "";
        if (typeof uploadedFileKey === 'string') {
            safeKey = uploadedFileKey;
        } else if (uploadedFileKey && typeof uploadedFileKey === 'object') {
            // Se per errore arriva un oggetto, prendiamo la proprietà 'key' o la prima stringa
            safeKey = uploadedFileKey.key || uploadedFileKey.url || "";
        }
        
        const cleanKey = safeKey ? safeKey.replace(/^\//, '') : null;
        // -----------------------------------------------------------

        const isPaid = (paymentMethod === 'stripe' || paymentMethod === 'paypal' || (paymentMethod === 'dev' && IS_DEV_MODE));
        
        let safeDetailedQuantities = '{}';
        try { safeDetailedQuantities = JSON.stringify(items?.detailedQuantities || {}); } catch (e) {}

        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || 'N/D' },
            { key: 'Back Print', value: items?.backPrint || 'N/D' },
            { key: 'Format', value: items?.format || 'custom' },
            { key: 'Dimensions', value: items?.dimensions || 'N/D' },
            { key: 'Detailed Quantities', value: safeDetailedQuantities },
            { key: 'Meters', value: items?.meters || '0' },
            { key: 'Full Service', value: items?.fullService ? 'Si' : 'No' },
            { key: 'Flash Order', value: items?.flashOrder ? 'Si' : 'No' },
            { key: '_file_uploaded_to_s3', value: cleanKey ? 'yes' : 'no' },
            { key: '_s3_file_key', value: cleanKey || '' }
        ];

        const orderData = {
            payment_method: paymentMethod === 'dev' ? 'bacs' : paymentMethod,
            set_paid: isPaid,
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                email: customer?.email || 'info@dtfitalia.it',
            },
            line_items: [{
                product_id: items?.productId || 488,
                quantity: items?.quantity || 1,
                total: String(pricing?.totalPrice || "0.00"),
                meta_data
            }]
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse?.id;

        if (!orderId) throw new Error("WooCommerce non ha restituito un ID ordine");

        // --- LOGICA SPOSTAMENTO S3 ---
        if (cleanKey && !testOptions?.skipS3 && cleanKey.includes('temp/')) {
            try {
                const fileName = cleanKey.split('/').pop(); 
                const newKey = `uploads/orders/ordine-${orderId}-${fileName}`;
                const copySource = encodeURI(`${bucket}/${cleanKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: copySource,
                    Key: newKey
                }));

                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: cleanKey }));
                
                // Aggiornamento post-spostamento
                await updateWooCommerceOrder(orderId, {
                    meta_data: [{ key: '_s3_file_key', value: newKey }]
                });
            } catch (s3Error) {
                console.error("S3 Move Error:", s3Error.message);
            }
        }
        
        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error("FINAL ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
    const bucket = S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

    try {
        const body = await request.json();
        const { 
            type = 'dtf',
            customer = {}, 
            shipping = { option: 'pickup', cost: 0 }, 
            paymentMethod = 'bacs', 
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            testOptions = { skipS3: false }
        } = body;

        // --- 1. IDENTIFICAZIONE FILE ---
        // Se uploadedFileKey arriva come "uploads/temp/...", lo usiamo così com'è
        const cleanKey = typeof uploadedFileKey === 'string' ? uploadedFileKey.replace(/^\//, '') : null;
        const hasFile = !!cleanKey;

        // --- 2. LOGICA METADATI DINAMICA (DTF vs Serigrafia) ---
        let safeDetailedQuantities = '{}';
        try { safeDetailedQuantities = JSON.stringify(items?.detailedQuantities || items?.quantities || {}); } catch (e) {}

        const meta_data = [
            // Se è serigrafia usa frontPrint, se è DTF potrebbe non esserci o essere diverso
            { key: 'Front Print', value: items?.frontPrint || (type === 'dtf' ? 'Stampa DTF' : 'N/D') },
            { key: 'Back Print', value: items?.backPrint || 'N/D' },
            { key: 'Format', value: items?.format || 'custom' },
            { key: 'Dimensions', value: items?.dimensions || (items?.width ? `${items.width}x${items.height}cm` : 'N/D') },
            { key: 'Detailed Quantities', value: safeDetailedQuantities },
            { key: 'Meters', value: String(items?.meters || '0') },
            { key: 'Full Service', value: items?.isFullService ? 'Si' : 'No' },
            { key: 'Flash Order', value: items?.isFlashOrder ? 'Si' : 'No' },
            { key: '_file_uploaded_to_s3', value: hasFile ? 'yes' : 'no' },
            { key: '_s3_file_key', value: cleanKey || '' }
        ];

        // --- 3. CREAZIONE ORDINE ---
        const orderData = {
            payment_method: paymentMethod === 'dev' ? 'bacs' : paymentMethod,
            set_paid: (paymentMethod === 'stripe' || paymentMethod === 'paypal' || (paymentMethod === 'dev' && IS_DEV_MODE)),
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                email: customer?.email || '',
                phone: customer?.phone || ''
            },
            line_items: [{
                product_id: items?.productId || (type === 'serigrafia' ? 240 : 488),
                quantity: items?.quantity || items?.totalQuantity || 1,
                total: String(pricing?.totalPrice || "0.00"),
                meta_data
            }]
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse?.id;
        if (!orderId) throw new Error("Errore WooCommerce: ID non ricevuto");

        // --- 4. SPOSTAMENTO S3 (Solo se il file è in uploads/temp/) ---
        if (hasFile && !testOptions?.skipS3 && cleanKey.includes('uploads/temp/')) {
            try {
                const rawFileName = cleanKey.split('/').pop(); 
                // Pulizia timestamp: prende tutto quello che c'è dopo il primo trattino
                const cleanFileName = rawFileName.includes('-') ? rawFileName.split('-').slice(1).join('-') : rawFileName;
                
                const newKey = `uploads/orders/ordine-${orderId}-${cleanFileName}`;
                const copySource = encodeURI(`${bucket}/${cleanKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: copySource,
                    Key: newKey
                }));

                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: cleanKey }));
                
                // Aggiorniamo WooCommerce con il nuovo percorso
                await updateWooCommerceOrder(orderId, {
                    meta_data: [{ key: '_s3_file_key', value: newKey }]
                });
            } catch (s3Error) {
                console.error("S3 MOVE ERROR:", s3Error.message);
            }
        }
        
        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error("ORDER API CRASH:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
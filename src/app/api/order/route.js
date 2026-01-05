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
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            testOptions = { skipS3: false }
        } = body;

        // --- 1. GESTIONE CHIAVE S3 (STRINGA O ARRAY) ---
        let finalKey = "";
        if (typeof uploadedFileKey === 'string') {
            finalKey = uploadedFileKey;
        } else if (Array.isArray(uploadedFileKey) && uploadedFileKey.length > 0) {
            finalKey = uploadedFileKey[0].key || uploadedFileKey[0].s3Key || "";
        }
        
        const cleanKey = finalKey.replace(/^\//, '');
        const hasFile = cleanKey.length > 0;

        // --- 2. ESTRAZIONE METRI E QUANTITÀ ---
        // Recupero metri per DTF
        const metersValue = items?.price?.details?.totalMeters || items?.meters || '0';
        
        // Recupero quantità per Serigrafia (o DTF)
        let safeDetailedQuantities = 'N/D';
        try { 
            const q = items?.quantities || items?.detailedQuantities || {};
            safeDetailedQuantities = Object.keys(q).length > 0 ? JSON.stringify(q) : 'N/D';
        } catch (e) {}

        // --- 3. NORMALIZZAZIONE METADATI ---
        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || (type === 'dtf' ? 'Stampa DTF' : 'N/D') },
            { key: 'Back Print', value: items?.backPrint || 'N/D' },
            { key: 'Format', value: items?.format || 'Personalizzato' },
            { key: 'Dimensions', value: items?.width ? `${items.width}x${items.height}cm` : (items?.dimensions || 'N/D') },
            { key: 'Detailed Quantities', value: safeDetailedQuantities },
            { key: 'Meters', value: String(metersValue) },
            { key: 'Full Service', value: (items?.isFullService || items?.fileCheck) ? 'Si' : 'No' },
            { key: 'Flash Order', value: items?.isFlashOrder ? 'Si' : 'No' },
            { key: '_file_uploaded_to_s3', value: hasFile ? 'yes' : 'no' },
            { key: '_s3_file_key', value: cleanKey || '' },
            { key: '_configurator_type', value: type }
        ];

        // --- 4. CREAZIONE ORDINE WOOCOMMERCE ---
        const orderData = {
            payment_method: body.paymentMethod === 'dev' ? 'bacs' : body.paymentMethod,
            set_paid: (body.paymentMethod === 'stripe' || body.paymentMethod === 'paypal' || (body.paymentMethod === 'dev' && IS_DEV_MODE)),
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                email: customer?.email || '',
                address_1: customer?.address || '',
                city: customer?.city || '',
                postcode: customer?.zip || '',
                phone: customer?.phone || ''
            },
            line_items: [{
                product_id: items?.productId || (type === 'serigrafia' ? 240 : 488),
                quantity: items?.totalQuantity || items?.quantity || 1,
                total: String(pricing?.finalTotal || pricing?.totalPrice || "0.00"),
                meta_data
            }]
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse?.id;

        if (!orderId) throw new Error("ID ordine WooCommerce non ricevuto.");

        // --- 5. SPOSTAMENTO S3 ---
        if (hasFile && !testOptions?.skipS3) {
            try {
                // Cerchiamo il file ovunque sia (root o temp)
                const sourceKey = cleanKey.includes('uploads/') ? cleanKey : `uploads/temp/${cleanKey}`;
                const rawFileName = cleanKey.split('/').pop(); 
                const cleanFileName = rawFileName.includes('-') ? rawFileName.split('-').slice(1).join('-') : rawFileName;
                
                const newKey = `uploads/orders/ordine-${orderId}-${cleanFileName}`;
                const copySource = encodeURI(`${bucket}/${sourceKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: copySource,
                    Key: newKey
                }));

                await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: sourceKey }));
                
                await updateWooCommerceOrder(orderId, {
                    meta_data: [{ key: '_s3_file_key', value: newKey }]
                });
            } catch (s3Error) {
                console.error("ERRORE S3:", s3Error.message);
            }
        }
        
        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error("ORDER API ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
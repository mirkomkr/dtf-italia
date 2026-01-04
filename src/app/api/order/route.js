import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_REGION, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
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

        // 1. Map Payment Method
        let payment_method = 'bacs';
        let payment_method_title = 'Bonifico Bancario';
        let set_paid = false;

        if (paymentMethod === 'stripe') {
            payment_method = 'stripe';
            payment_method_title = 'Carta di Credito (Stripe)';
            set_paid = true;
        } else if (paymentMethod === 'paypal') {
             payment_method = 'paypal';
             payment_method_title = 'PayPal';
             set_paid = true;
        } else if (paymentMethod === 'dev' && IS_DEV_MODE) {
            payment_method = 'bacs';
            payment_method_title = 'Bonifico Bancario (Dev Test)';
            set_paid = true;
        }

        // 2. Costruzione METADATI UNIFICATA
        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || 'Nessuna stampa fronte' },
            { key: 'Back Print', value: items?.backPrint || 'Nessuna stampa retro' },
            { key: 'Format', value: items?.format || 'custom' },
            { key: 'Dimensions', value: items?.dimensions || 'N/D' },
            { key: 'Detailed Quantities', value: JSON.stringify(items?.detailedQuantities || {}) },
            { key: 'Meters', value: items?.meters || '0' },
            { key: 'Full Service', value: items?.fullService ? 'Si' : 'No' },
            { key: 'Flash Order', value: items?.flashOrder ? 'Si' : 'No' }
        ];

        // --- LOGICA STATO S3 (PER ORDINE E ITEM) ---
        const hasFile = !!uploadedFileKey && !testOptions?.skipS3;
        const s3_meta = [];

        if (hasFile) {
            s3_meta.push({ key: '_file_uploaded_to_s3', value: 'yes' });
            s3_meta.push({ key: '_s3_file_key', value: uploadedFileKey });
        } else {
            s3_meta.push({ key: '_file_uploaded_to_s3', value: 'no' }); 
        }

        meta_data.push(...s3_meta);

        if (paymentMethod === 'dev' && IS_DEV_MODE) {
            meta_data.push({ key: '_is_dev_test', value: 'yes' });
        }

        const line_items = [{
            product_id: items?.productId || (type === 'serigrafia' ? 240 : 488),
            quantity: items?.quantity || items?.totalQuantity || 1,
            total: String(pricing?.totalPrice || "0.00"),
            meta_data: meta_data
        }];

        // 4. Construct Order Data
        const orderData = {
            payment_method,
            payment_method_title,
            set_paid,
            currency: 'EUR',
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                address_1: customer?.address || '',
                city: customer?.city || '',
                postcode: customer?.zip || '',
                email: customer?.email || 'info@dtfitalia.it',
                country: 'IT',
                phone: customer?.phone || ''
            },
            shipping: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                address_1: shipping?.option === 'shipping' ? (customer?.address || '') : 'Via dei Castelli Romani, 22',
                city: shipping?.option === 'shipping' ? (customer?.city || '') : 'Pomezia',
                postcode: shipping?.option === 'shipping' ? (customer?.zip || '') : '00071',
                country: 'IT'
            },
            line_items,
            shipping_lines: [{
                method_id: shipping?.option === 'pickup' ? 'local_pickup' : 'flat_rate',
                method_title: shipping?.option === 'pickup' ? 'Ritiro in Sede' : 'Spedizione Standard',
                total: String(shipping?.cost || "0")
            }],
            meta_data: s3_meta
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse.id;

        // --- LOGICA SPOSTAMENTO FILE S3 ---
        let finalFileKey = uploadedFileKey;
        const cleanKey = uploadedFileKey ? uploadedFileKey.replace(/^\//, '') : null;
        const shouldMoveFile = cleanKey && !testOptions?.skipS3 && cleanKey.includes('temp/');

        if (shouldMoveFile) {
            try {
                const fileName = cleanKey.split('/').pop(); 
                const newKey = `uploads/orders/${orderId}/${fileName}`;
                
                // IMPORTANTE: CopySource richiede il formato "bucket/percorso/file" URL-encoded
                const sourcePath = `${S3_BUCKET_NAME}/${cleanKey}`;

                console.log(`[DEBUG] S3 Copy: ${sourcePath} -> ${newKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    CopySource: encodeURI(sourcePath), 
                    Key: newKey
                }));

                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    Key: cleanKey
                }));

                finalFileKey = newKey;

                // Aggiornamento Metadati su WC
                await updateWooCommerceOrder(orderId, {
                    meta_data: [
                        { key: '_s3_file_key', value: finalFileKey },
                        { key: '_file_uploaded_to_s3', value: 'yes' }
                    ]
                });
            } catch (s3Error) {
                console.error("S3 Move Error:", s3Error);
                await updateWooCommerceOrder(orderId, {
                    customer_note: `Errore S3: Il file è rimasto in temp. Path: ${uploadedFileKey}`
                });
            }
        }
        
        return NextResponse.json({ 
            success: true, 
            orderId: orderId,
            total: wcResponse.total,
            finalFileKey
        });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
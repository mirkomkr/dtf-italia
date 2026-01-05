import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_REGION, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
    // Definizione sicura del bucket con fallback
    const bucket = S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;

    try {
        const body = await request.json();
        console.log("INCOMING ORDER BODY:", body);
        
        // Destructure con valori di default e optional chaining aggressivo per evitare crash
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

        // 2. Map Line Items con check di sicurezza
        const line_items = [];
        const defaultId = type === 'serigrafia' ? 240 : 488;
        
        // Costruzione Safe dei Metadati
        let safeDetailedQuantities = '{}';
        try {
            safeDetailedQuantities = JSON.stringify(items?.detailedQuantities || {});
        } catch (e) {
            console.error("JSON Stringify Error:", e);
        }

        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || 'Nessuna stampa fronte' },
            { key: 'Back Print', value: items?.backPrint || 'Nessuna stampa retro' },
            { key: 'Format', value: items?.format || 'custom' },
            { key: 'Dimensions', value: items?.dimensions || 'N/D' },
            { key: 'Detailed Quantities', value: safeDetailedQuantities },
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

        line_items.push({
            product_id: items?.productId || defaultId,
            quantity: items?.quantity || items?.totalQuantity || 1,
            total: String(pricing?.totalPrice || "0.00"),
            meta_data: meta_data
        });

        // 3. Map Shipping
        const shippingOption = shipping?.option || 'pickup';
        const shipping_lines = [{
            method_id: shippingOption === 'pickup' ? 'local_pickup' : 'flat_rate',
            method_title: shippingOption === 'pickup' ? 'Ritiro in Sede' : 'Spedizione Standard',
            total: String(shipping?.cost || "0")
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
                address_1: shippingOption === 'shipping' ? (customer?.address || '') : 'Via dei Castelli Romani, 22',
                city: shippingOption === 'shipping' ? (customer?.city || '') : 'Pomezia',
                postcode: shippingOption === 'shipping' ? (customer?.zip || '') : '00071',
                country: 'IT'
            },
            line_items,
            shipping_lines,
            meta_data: s3_meta 
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        // Validazione ID risposta WC
        if (!wcResponse?.id) {
             console.error("WC Response Invalid:", wcResponse);
             throw new Error("WooCommerce ha restituito una risposta senza ID");
        }
        const orderId = wcResponse.id;

        // --- OTTIMIZZAZIONE S3: SPOSTAMENTO E AGGIORNAMENTO UNIFICATO ---
        let finalFileKey = uploadedFileKey;
        const wcUpdates = {}; 
        const cleanKey = uploadedFileKey ? uploadedFileKey.replace(/^\//, '') : null;
        const shouldMoveFile = cleanKey && !testOptions?.skipS3 && cleanKey.includes('temp/');

        if (shouldMoveFile) {
            try {
                const fileName = cleanKey.split('/').pop(); 
                const newKey = `uploads/orders/${orderId}/${fileName}`;
                
                // USIAMO LA VARIABILE BUCKET SICURA + SLASH INIZIALE
                const source = `/${bucket}/${cleanKey}`;

                console.log(`[DEBUG] Moving from ${source} to ${newKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: source,
                    Key: newKey
                }));

                await s3Client.send(new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: cleanKey
                }));

                finalFileKey = newKey;

                wcUpdates.meta_data = [
                    { key: '_s3_file_key', value: finalFileKey },
                    { key: '_file_uploaded_to_s3', value: 'yes' }
                ];

            } catch (s3Error) {
                console.error("S3 Move Error:", s3Error);
                wcUpdates.customer_note = `ERRORE SISTEMA: Spostamento S3 fallito. File rimasto in: ${uploadedFileKey}. Errore: ${s3Error.message}`;
            }
        }

        if (Object.keys(wcUpdates).length > 0) {
            try {
                await updateWooCommerceOrder(orderId, wcUpdates);
            } catch (wcError) {
                console.error("Failed to update WooCommerce with S3 result:", wcError);
            }
        }
        
        return NextResponse.json({ 
            success: true, 
            orderId: orderId,
            total: wcResponse.total,
            finalFileKey
        });

    } catch (error) {
        console.error("FULL ORDER API ERROR:", error, error.stack);
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        }, { status: 500 });
    }
}
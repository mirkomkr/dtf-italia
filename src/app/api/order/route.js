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
            customer = {}, 
            shipping = { option: 'pickup', cost: 0 }, 
            paymentMethod = 'bacs', 
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            testOptions = { skipS3: false }
        } = body;

        // 1. Logica Pagamento
        const isPaid = (paymentMethod === 'stripe' || paymentMethod === 'paypal' || (paymentMethod === 'dev' && IS_DEV_MODE));
        
        // 2. Costruzione Metadati (TUTTI i campi originali)
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
            { key: '_file_uploaded_to_s3', value: uploadedFileKey ? 'yes' : 'no' },
            { key: '_s3_file_key', value: uploadedFileKey || '' }
        ];

        // 3. Preparazione Dati Ordine
        const orderData = {
            payment_method: paymentMethod === 'dev' ? 'bacs' : paymentMethod,
            payment_method_title: paymentMethod === 'stripe' ? 'Stripe' : 'Pagamento Online',
            set_paid: isPaid,
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                address_1: customer?.address || '',
                city: customer?.city || '',
                postcode: customer?.zip || '',
                email: customer?.email || 'info@dtfitalia.it',
                phone: customer?.phone || ''
            },
            shipping: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                address_1: shipping?.option === 'shipping' ? (customer?.address || '') : 'Via dei Castelli Romani, 22',
                city: shipping?.option === 'shipping' ? (customer?.city || '') : 'Pomezia',
                postcode: shipping?.option === 'shipping' ? (customer?.zip || '') : '00071'
            },
            line_items: [{
                product_id: items?.productId || 488,
                quantity: items?.quantity || 1,
                total: String(pricing?.totalPrice || "0.00"),
                meta_data
            }],
            shipping_lines: [{
                method_id: shipping?.option === 'pickup' ? 'local_pickup' : 'flat_rate',
                method_title: shipping?.option === 'pickup' ? 'Ritiro in Sede' : 'Spedizione Standard',
                total: String(shipping?.cost || "0")
            }]
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        if (!wcResponse?.id) throw new Error("ID ordine mancante da WooCommerce");
        const orderId = wcResponse.id;

        // 4. SPOSTAMENTO S3 POST-PAGAMENTO (Isolato)
        let finalFileKey = uploadedFileKey;
        const cleanKey = uploadedFileKey?.replace(/^\//, '');

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
                
                finalFileKey = newKey;
                await updateWooCommerceOrder(orderId, {
                    meta_data: [{ key: '_s3_file_key', value: finalFileKey }]
                });
            } catch (s3Error) {
                console.error("S3 Move Error (Handled):", s3Error.message);
            }
        }
        
        return NextResponse.json({ success: true, orderId, finalFileKey });

    } catch (error) {
        console.error("FULL ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
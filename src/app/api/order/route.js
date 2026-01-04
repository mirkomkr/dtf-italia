import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            customer = {}, 
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            paymentMethod = 'bacs'
        } = body;

        // 1. Prepariamo i metadati base
        const meta_data = [
            { key: '_file_uploaded_to_s3', value: uploadedFileKey ? 'yes' : 'no' },
            { key: '_s3_file_key', value: uploadedFileKey || '' },
            { key: 'Format', value: items?.format || 'custom' }
        ];

        // 2. Creiamo l'ordine su WooCommerce
        const orderData = {
            payment_method: paymentMethod,
            payment_method_title: paymentMethod === 'bacs' ? 'Bonifico' : 'Pagamento Online',
            set_paid: paymentMethod !== 'bacs',
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                email: customer?.email || '',
                country: 'IT'
            },
            line_items: [{
                product_id: items?.productId || 488,
                quantity: items?.quantity || 1,
                total: String(pricing?.totalPrice || "0.00"),
                meta_data: meta_data
            }]
        };

        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse.id;

        // 3. Spostamento File S3 (Solo se esiste ed è in temp)
        if (uploadedFileKey && uploadedFileKey.includes('temp/')) {
            try {
                const cleanKey = uploadedFileKey.replace(/^\//, '');
                const fileName = cleanKey.split('/').pop();
                const newKey = `uploads/orders/${orderId}/${fileName}`;

                console.log(`Tentativo copia S3 da: /${S3_BUCKET_NAME}/${cleanKey}`);

                await s3Client.send(new CopyObjectCommand({
    Bucket: S3_BUCKET_NAME,
    
    CopySource: `/${S3_BUCKET_NAME}/${encodeURI(cleanKey)}`, 
    Key: newKey
}));

                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    Key: cleanKey
                }));

                await updateWooCommerceOrder(orderId, {
                    meta_data: [{ key: '_s3_file_key', value: newKey }]
                });

                console.log("Spostamento completato con successo!");

            } catch (s3Error) {
                console.error("Errore specifico S3:", s3Error.name, s3Error.message);
            }
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error("ERRORE API ORDER:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
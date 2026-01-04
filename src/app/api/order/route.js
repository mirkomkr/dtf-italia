import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3-client';

export async function POST(request) {
    try {
        console.log("--- INIZIO PROCESSO ORDINE ---");
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

        console.log("Dati ricevuti per ordine:", { orderId: items?.productId, file: uploadedFileKey });

        // 1. Validazione Bucket
        if (!S3_BUCKET_NAME) {
            throw new Error("CONFIG ERROR: S3_BUCKET_NAME non è definito nelle variabili d'ambiente.");
        }

        // 2. Map Payment Method
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

        // 3. Costruzione Metadati
        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || 'Nessuna' },
            { key: 'Format', value: items?.format || 'custom' },
            { key: '_file_uploaded_to_s3', value: uploadedFileKey ? 'yes' : 'no' },
            { key: '_s3_file_key', value: uploadedFileKey || '' }
        ];

        const orderData = {
            payment_method,
            payment_method_title,
            set_paid,
            currency: 'EUR',
            billing: {
                first_name: customer?.firstName || 'Cliente',
                last_name: customer?.lastName || 'Guest',
                email: customer?.email || 'info@dtfitalia.it',
                country: 'IT'
            },
            line_items: [{
                product_id: items?.productId || (type === 'serigrafia' ? 240 : 488),
                quantity: items?.quantity || 1,
                total: String(pricing?.totalPrice || "0.00"),
                meta_data: meta_data
            }]
        };
        
        console.log("Chiamata a WooCommerce...");
        const wcResponse = await createWooCommerceOrder(orderData);
        const orderId = wcResponse.id;
        console.log("Ordine creato con successo su WC. ID:", orderId);

        // --- LOGICA SPOSTAMENTO FILE S3 ---
        let finalFileKey = uploadedFileKey;
        const cleanKey = uploadedFileKey ? uploadedFileKey.replace(/^\//, '') : null;
        
        // Verifica se dobbiamo spostare
        const shouldMoveFile = cleanKey && !testOptions?.skipS3 && cleanKey.includes('temp/');

        if (shouldMoveFile) {
            console.log("Tentativo di spostamento file S3:", cleanKey);
            try {
                const fileName = cleanKey.split('/').pop(); 
                const newKey = `uploads/orders/${orderId}/${fileName}`;
                
                // Formato richiesto da AWS SDK v3: bucket/path (senza slash iniziale nel CopySource)
                const sourcePath = `${S3_BUCKET_NAME}/${cleanKey}`;

                console.log(`Eseguo CopyObject: ${sourcePath} -> ${newKey}`);

                await s3Client.send(new CopyObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    CopySource: encodeURI(sourcePath), 
                    Key: newKey
                }));

                console.log("Copia completata. Elimino originale...");

                await s3Client.send(new DeleteObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    Key: cleanKey
                }));

                finalFileKey = newKey;

                await updateWooCommerceOrder(orderId, {
                    meta_data: [
                        { key: '_s3_file_key', value: finalFileKey }
                    ]
                });
                console.log("Metadati aggiornati con nuova key definitiva.");

            } catch (s3Error) {
                console.error("ERRORE DURANTE SPOSTAMENTO S3:", s3Error.message);
                // Non facciamo crashare l'intera API se S3 fallisce, l'ordine esiste già.
            }
        }
        
        return NextResponse.json({ 
            success: true, 
            orderId: orderId,
            finalFileKey
        });

    } catch (error) {
        // --- CATCH FINALE: QUESTO LOG È QUELLO CHE MI SERVE ---
        console.error("!!! CRASH API ORDER !!!");
        console.error("Messaggio:", error.message);
        console.error("Stack:", error.stack);

        return NextResponse.json({ 
            success: false, 
            error: error.message,
            debug_info: "Controlla i log di Vercel per lo stack trace completo."
        }, { status: 500 });
    }
}
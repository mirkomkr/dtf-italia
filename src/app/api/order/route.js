import { NextResponse } from 'next/server';
import { createWooCommerceOrder, updateWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
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

        // --- 1. NORMALIZZAZIONE FILE INPUT ---
        // Supportiamo: stringa (legacy), array (legacy), oggetto {front, back} (nuovo)
        const filesToProcess = {}; // { front: 'key', back: 'key' }

        if (uploadedFileKey) {
            if (typeof uploadedFileKey === 'string') {
                filesToProcess.front = uploadedFileKey;
            } else if (Array.isArray(uploadedFileKey) && uploadedFileKey.length > 0) {
                filesToProcess.front = uploadedFileKey[0].key || uploadedFileKey[0].s3Key || "";
            } else if (typeof uploadedFileKey === 'object') {
                if (uploadedFileKey.front) filesToProcess.front = uploadedFileKey.front;
                if (uploadedFileKey.back) filesToProcess.back = uploadedFileKey.back;
            }
        }

        const hasFiles = Object.keys(filesToProcess).length > 0;

        // --- 2. VALIDAZIONE PRE-ORDINE (HEAD OBJECT) ---
        // Verifichiamo che i file esistano in S3 prima di creare l'ordine
        if (hasFiles && !testOptions?.skipS3) {
            for (const [keyType, fileKey] of Object.entries(filesToProcess)) {
                if (!fileKey) continue;
                try {
                     // Gestione path: se manca uploads/, assumiamo sia in temp
                    const checkKey = fileKey.includes('uploads/') ? fileKey : `uploads/temp/${fileKey}`;
                    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: checkKey }));
                } catch (err) {
                    console.error(`S3 VALIDATION FAILED for ${keyType}:`, err.message);
                    return NextResponse.json(
                        { success: false, error: `File ${keyType} non trovato o scaduto. Riprova l'upload.` },
                        { status: 400 }
                    );
                }
            }
        }

        // --- 3. ESTRAZIONE DATI ---
        const metersValue = items?.price?.details?.totalMeters || items?.meters || '0';
        let safeDetailedQuantities = 'N/D';
        try { 
            const q = items?.quantities || items?.detailedQuantities || {};
            safeDetailedQuantities = Object.keys(q).length > 0 ? JSON.stringify(q) : 'N/D';
        } catch (e) {}

        // --- 4. PREPARAZIONE METADATI ---
        const meta_data = [
            { key: 'Front Print', value: items?.frontPrint || (type === 'dtf' ? 'Stampa DTF' : 'N/D') },
            { key: 'Back Print', value: items?.backPrint || 'N/D' },
            { key: 'Format', value: items?.format || 'Personalizzato' },
            { key: 'Dimensions', value: items?.width ? `${items.width}x${items.height}cm` : (items?.dimensions || 'N/D') },
            { key: 'Detailed Quantities', value: safeDetailedQuantities },
            { key: 'Meters', value: String(metersValue) },
            { key: 'Full Service', value: (items?.isFullService || items?.fileCheck) ? 'Si' : 'No' },
            { key: 'Flash Order', value: items?.isFlashOrder ? 'Si' : 'No' },
            { key: '_file_uploaded_to_s3', value: hasFiles ? 'yes' : 'no' },
            { key: '_configurator_type', value: type }
        ];

        // Aggiungiamo metadati specifici per i file
        if (filesToProcess.front) meta_data.push({ key: '_s3_file_key_front', value: filesToProcess.front }); // Placeholder, aggiornato dopo spostamento
        if (filesToProcess.back) meta_data.push({ key: '_s3_file_key_back', value: filesToProcess.back });


        // --- 5. CREAZIONE ORDINE WOOCOMMERCE ---
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

        // --- 6. SPOSTAMENTO S3 TRANSACTION-LIKE ---
        const movedFiles = []; // Tiene traccia per rollback
        const finalKeys = {};

        if (hasFiles && !testOptions?.skipS3) {
            try {
                for (const [keyType, originalKey] of Object.entries(filesToProcess)) {
                    if (!originalKey) continue;

                    const sourceKey = originalKey.includes('uploads/') ? originalKey : `uploads/temp/${originalKey}`;
                    const rawFileName = originalKey.split('/').pop(); 
                    // Pulizia nome: se ha già timestamp (123123-nome.pdf), lo teniamo o lo cambiamo? 
                    // Best practice: usiamo un prefisso chiaro per l'ordine
                    const cleanFileName = rawFileName.replace(/^[0-9]+-/, ''); // Rimuove timestamp iniziale se presente
                    
                    const suffix = keyType === 'front' ? 'FRONTE' : 'RETRO';
                    const newKey = `uploads/orders/ordine-${orderId}-${suffix}-${cleanFileName}`;
                    
                    // Copy
                    await s3Client.send(new CopyObjectCommand({
                        Bucket: bucket,
                        CopySource: encodeURI(`${bucket}/${sourceKey}`),
                        Key: newKey
                    }));

                    // Track success
                    movedFiles.push({ newKey, sourceKey });
                    finalKeys[keyType] = newKey;

                    // Delete old (solo se copia ok)
                    // NOTA: In dev mode o se vogliamo essere più sicuri, potremmo non cancellare subito se c'è rischio.
                    // Ma per ora manteniamo la logica: Copy -> Delete old
                    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: sourceKey }));
                }

                // Update WC Order con le path definitive
                const updateMeta = [];
                if (finalKeys.front) updateMeta.push({ key: '_s3_file_key_front', value: finalKeys.front });
                if (finalKeys.back) updateMeta.push({ key: '_s3_file_key_back', value: finalKeys.back });
                // Manteniamo '_s3_file_key' generico col primo file per backward compatibility se serve
                if (finalKeys.front) updateMeta.push({ key: '_s3_file_key', value: finalKeys.front });

                await updateWooCommerceOrder(orderId, { meta_data: updateMeta });

            } catch (moveError) {
                console.error("ERRORE SPOSTAMENTO S3 (ROLLBACK AVVIATO):", moveError);
                
                // --- ROLLBACK ---
                for (const moved of movedFiles) {
                    try {
                        // Eliminiamo i file MOVED dalla destinazione finale
                        await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: moved.newKey }));
                    } catch (rbError) {
                         console.error("ROLLBACK FAILED:", rbError);
                    }
                }
                
                // RESTITUIAMO ERRORE SPECIFICO AL CLIENT
                // Anche se l'ordine è creato (WooCommerce ID esiste), segnaliamo il fallimento file.
                return NextResponse.json({ 
                    success: false, 
                    orderId, // Ritorniamo ID così il client sa che l'ordine base esiste
                    error: "Errore durante il salvataggio dei file. L'ordine è stato creato ma i file non sono stati allegati correttamente.",
                    detail: moveError.message 
                }, { status: 500 });
            }
        }
        
        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error("ORDER API ERROR:", error.message);
        // Risposta JSON strutturata invece di 500 generico white screen
        return NextResponse.json({ 
            success: false, 
            error: "Errore interno del server durante la creazione dell'ordine.",
            detail: error.message 
        }, { status: 500 });
    }
}
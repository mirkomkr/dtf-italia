import { NextResponse } from 'next/server';
import { createWooCommerceOrder } from '@/lib/woocommerce';
import { IS_DEV_MODE } from '@/lib/config';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Destructure con valori di default per evitare Errori 500
        const { 
            type = 'dtf',
            customer = {}, 
            shipping = { option: 'pickup', cost: 0 }, 
            paymentMethod = 'bacs', 
            items = {}, 
            pricing = { totalPrice: 0 },
            uploadedFileKey = null,
            skipFiles = false
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
        
        // Costruiamo i meta_data base
        const meta_data = [
            { key: 'Front Print', value: items.frontPrint || 'N/A' },
            { key: 'Back Print', value: items.backPrint || 'N/A' }
        ];

        // SE ABBIAMO LA CHIAVE S3, LA AGGIUNGIAMO SUBITO QUI!
        if (uploadedFileKey) {
            meta_data.push({
                key: 's3_download_url',
                value: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${uploadedFileKey}`
            });
            meta_data.push({
                key: '_s3_file_key',
                value: uploadedFileKey
            });
        }

        // METADATI TEST (SOLO SE IS_DEV_MODE)
        if (paymentMethod === 'dev' && IS_DEV_MODE) {
            meta_data.push({ key: '_is_dev_test', value: 'yes' });
            if (skipFiles) {
                meta_data.push({ key: '_skip_files', value: 'yes' });
            }
        }

        line_items.push({
            product_id: items.productId || defaultId,
            quantity: items.quantity || items.totalQuantity || 1,
            total: String(pricing.totalPrice || "0.00"),
            meta_data: meta_data
        });

        // 3. Map Shipping
        const shipping_lines = [{
            method_id: shipping.option === 'pickup' ? 'local_pickup' : 'flat_rate',
            method_title: shipping.option === 'pickup' ? 'Ritiro in Sede' : 'Spedizione Standard',
            total: String(shipping.cost || "0")
        }];

        // 4. Construct Order Data
        const orderData = {
            payment_method,
            payment_method_title,
            set_paid,
            currency: 'EUR',
            billing: {
                first_name: customer.firstName || 'Cliente',
                last_name: customer.lastName || 'Guest',
                address_1: customer.address || '',
                city: customer.city || '',
                postcode: customer.zip || '',
                email: customer.email || 'info@dtfitalia.it',
                country: 'IT',
                phone: customer.phone || ''
            },
            shipping: {
                first_name: customer.firstName || 'Cliente',
                last_name: customer.lastName || 'Guest',
                address_1: shipping.option === 'shipping' ? (customer.address || '') : 'Via dei Castelli Romani, 22',
                city: shipping.option === 'shipping' ? (customer.city || '') : 'Pomezia',
                postcode: shipping.option === 'shipping' ? (customer.zip || '') : '00071',
                country: 'IT'
            },
            line_items,
            shipping_lines
        };
        
        const wcResponse = await createWooCommerceOrder(orderData);
        
        return NextResponse.json({ 
            success: true, 
            orderId: wcResponse.id,
            total: wcResponse.total
        });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        }, { status: 500 });
    }
}
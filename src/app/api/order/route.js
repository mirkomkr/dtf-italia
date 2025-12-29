import { NextResponse } from 'next/server';
import { createWooCommerceOrder } from '@/lib/woocommerce';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Destructure payload from UnifiedCheckout
        const { 
            type, // 'serigrafia' | 'dtf'
            customer, 
            shipping, 
            paymentMethod, 
            items, 
            pricing 
        } = body;

        // 1. Map Payment Method
        let payment_method = 'bacs';
        let payment_method_title = 'Bonifico Bancario';
        let set_paid = false;

        if (paymentMethod === 'stripe') {
            payment_method = 'stripe';
            payment_method_title = 'Carta di Credito (Stripe)';
            set_paid = true; // In production, this should be set via webhook, but for now we simulate "Paid"
        } else if (paymentMethod === 'paypal') {
             payment_method = 'paypal';
             payment_method_title = 'PayPal';
             set_paid = true;
        } else if (paymentMethod === 'test-s3') {
             payment_method = 'cod'; // Cash on delivery as fallback/test
             payment_method_title = 'TEST MODE - Pagamento Simulato';
             set_paid = true;
        }

        // 2. Map Line Items
        // We need to create a product line item. 
        // Ideally we use a real product ID (items.productId).
        // If items.productId is 0 or missing, we fall back to a generic product or just custom item if plugins allow.
        // Standard WC needs product_id for stock management, but we can use just 'name' and 'total'.
        // However, standard API usually requires product_id.
        // Let's assume we have a generic product ID for 'Custom Service' or we use the passed ID.
        
        const line_items = [];
        
        if (type === 'serigrafia') {
            // items = { quantities, singleQuantity, frontPrint ... }
            line_items.push({
                product_id: items.productId || 240, // Fallback ID if missing
                quantity: items.totalQuantity || items.singleQuantity || 1,
                total: String(pricing.totalPrice), // Total line price excluding tax? Or inclusive? WC expects standard behavior.
                // Note: WC API expects 'total' string.
                meta_data: [
                    { key: 'Front Print', value: items.frontPrint },
                    { key: 'Back Print', value: items.backPrint },
                    // Serialize detailed quantities if needed
                    { key: 'Detailed Quantities', value: JSON.stringify(items.quantities || {}) }
                ]
            });
        } else if (type === 'dtf') {
             // items = { format, width, height, quantity, isFullService ... }
             line_items.push({
                 product_id: items.productId || 488, // Fallback ID
                 quantity: items.quantity || 1,
                 total: String(pricing.totalPrice),
                 meta_data: [
                     { key: 'Format', value: items.format },
                     { key: 'Dimensions', value: `${items.width}x${items.height} cm` },
                     { key: 'Meters', value: pricing.details?.totalMeters || '0' },
                     { key: 'Full Service', value: items.isFullService ? 'Yes' : 'No' },
                     { key: 'Flash Order', value: items.isFlashOrder ? 'Yes' : 'No' }
                 ]
             });
        }

        // 3. Map Shipping
        const shipping_lines = [
            {
                method_id: shipping.option === 'pickup' ? 'local_pickup' : 'flat_rate',
                method_title: shipping.option === 'pickup' ? 'Ritiro in Sede' : 'Spedizione Standard',
                total: String(shipping.cost)
            }
        ];

        // 4. Construct Order Data
        const orderData = {
            payment_method,
            payment_method_title,
            set_paid,
            billing: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                postcode: customer.zip,
                email: customer.email,
                country: 'IT',
                phone: customer.phone || ''
            },
            shipping: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: shipping.option === 'shipping' ? customer.address : 'Via dei Castelli Romani, 22',
                city: shipping.option === 'shipping' ? customer.city : 'Pomezia',
                postcode: shipping.option === 'shipping' ? customer.zip : '00071',
                country: 'IT'
            },
            line_items,
            shipping_lines
        };
        
        console.log("Creating WC Order with:", JSON.stringify(orderData, null, 2));

        // 5. Create Order
        const wcResponse = await createWooCommerceOrder(orderData);
        
        console.log("WC Order Created:", wcResponse.id);

        return NextResponse.json({ 
            success: true, 
            orderId: wcResponse.id,
            total: wcResponse.total
        });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

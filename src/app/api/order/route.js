import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2,5).toUpperCase()}`;

        // In a real app, you would save 'body' to database/WooCommerce here.
        console.log("Order Received:", orderId, body);

        return NextResponse.json({ 
            success: true, 
            orderId 
        });

    } catch (error) {
        console.error("Order API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

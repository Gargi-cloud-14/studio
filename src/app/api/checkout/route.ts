
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/lib/types';

// Validate that the Stripe secret key is available.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

// Initialize Stripe with the secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST(request: Request) {
  const { items, accessDuration }: { items: CartItem[], accessDuration?: number } = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items in the cart.' }, { status: 400 });
  }

  // Transform cart items into Stripe's line_items format
  const line_items = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        // We could add images here if they were publicly hosted URLs
        // images: [item.product.imageUrl]
      },
      unit_amount: Math.round(item.product.price * 100), // Price in cents
    },
    quantity: item.quantity,
  }));
  
  // Attach accessDuration to the success URL so we can retrieve it on the client side
  // This is a workaround for the prototype. In a real app, you would store this
  // in your database against a pre-created order ID and pass that ID in the metadata.
  const successUrl = new URL('/success', baseUrl);
  successUrl.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');
  if (accessDuration) {
    successUrl.searchParams.append('accessDuration', accessDuration.toString());
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: `${baseUrl}/cancel`,
    });

    if (session.url) {
      return NextResponse.json({ url: session.url });
    } else {
      // This case should ideally not happen if the session is created successfully.
      return NextResponse.json({ error: 'Stripe session URL not found.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Stripe Error:', error.message);
    return NextResponse.json({ error: `Error creating checkout session: ${error.message}` }, { status: 500 });
  }
}

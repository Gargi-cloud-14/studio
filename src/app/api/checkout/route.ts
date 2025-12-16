
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/lib/types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST(request: Request) {
  const { items, accessDuration, userId }: { items: CartItem[], accessDuration?: number, userId?: string } = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items in the cart.' }, { status: 400 });
  }

  const hasDigitalProduct = items.some(item => item.product.isDigital);
  if (hasDigitalProduct && !userId) {
    // While we don't persist users, we need some user context for digital goods to avoid checkout errors.
    // In a real app this might be more robust.
    return NextResponse.json({ error: 'You must be logged in to purchase digital items.' }, { status: 401 });
  }

  const line_items = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description,
        metadata: {
          productId: item.product.id,
          isDigital: String(item.product.isDigital),
        }
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));
  
  const successUrl = new URL('/success', baseUrl);
  successUrl.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}');

  // If there are digital items, pass the duration and product info to the success page
  if (hasDigitalProduct) {
    if (accessDuration) {
      successUrl.searchParams.append('duration', String(accessDuration));
    }
    const digitalProducts = items.filter(i => i.product.isDigital).map(i => ({
        name: i.product.name,
        id: i.product.id
    }));
    successUrl.searchParams.append('digital_products', JSON.stringify(digitalProducts));
  }


  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: `${baseUrl}/cancel`,
      // We no longer use webhooks for this simplified flow, so metadata is less critical.
      metadata: {
        userId: userId || '',
      }
    });

    if (session.url) {
      return NextResponse.json({ url: session.url });
    } else {
      return NextResponse.json({ error: 'Stripe session URL not found.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Stripe Error:', error.message);
    return NextResponse.json({ error: `Error creating checkout session: ${error.message}` }, { status: 500 });
  }
}

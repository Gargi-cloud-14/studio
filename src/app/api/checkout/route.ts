import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate that the Stripe secret key is available.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables.');
}

// Initialize Stripe with the secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
              description: 'This is a sample product for testing Stripe Checkout.',
            },
            unit_amount: 2000, // $20.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
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
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}

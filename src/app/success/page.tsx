
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orders } from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { items: cartItems, totalPrice } = useCart(); // We'll use the cart state before it was cleared
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, you would fetch the session from Stripe to verify payment
    // and get the metadata. In this prototype, we'll simulate order creation
    // using the cart state from before redirection.
    if (sessionId && user && cartItems.length > 0) {
      
      // In a real app, you'd retrieve this from the Stripe session object's metadata
      // For the prototype, we get it from search params if available, or default.
      const accessDurationParam = searchParams.get('accessDuration');
      const accessDuration = accessDurationParam ? parseInt(accessDurationParam) : 86400; // Default to 24h
      
      const newOrder = {
        id: sessionId.substring(0, 12),
        userId: user.id, // Associate the order with the logged-in user
        items: cartItems,
        status: 'Paid' as const,
        date: new Date().toISOString(),
        total: totalPrice,
        accessDuration: accessDuration,
        linkActivatedAt: new Date().toISOString(), // Start the timer now!
      };

      // Add to our mock database
      // Avoid adding duplicates if the user refreshes
      if (!orders.find(o => o.id === newOrder.id)) {
        orders.push(newOrder);
      }
    }
    // The cart is cleared in CheckoutButton.tsx before redirecting to Stripe
  }, [sessionId, cartItems, totalPrice, searchParams, user]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="font-headline text-4xl mt-6">Payment Successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your purchase. Your order is being processed.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/downloads">View My Downloads</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        router.push(url); // Redirect to Stripe's checkout page
      } else {
        throw new Error('Stripe URL not returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // You could show a toast or an alert to the user here
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 text-white hover:bg-blue-700"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Proceed to Checkout
        </>
      )}
    </Button>
  );
}


"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  accessDuration?: number;
}

export function CheckoutButton({ accessDuration }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, accessDuration }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || 'Failed to create checkout session');
      }

      if (body.url) {
        // Stripe will redirect, but good to clear the cart now.
        // We could also do this on the success page, but this feels cleaner.
        clearCart(); 
        router.push(body.url); // Redirect to Stripe's checkout page
      } else {
        throw new Error('Stripe URL not returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: error.message || 'There was a problem with the checkout process.',
      })
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      size="lg"
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Proceed to Secure Payment
        </>
      )}
    </Button>
  );
}


"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  accessDuration?: number;
}

export function CheckoutButton({ accessDuration }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { items } = useCart();
  const { user, showLogin } = useAuth();
  const { toast } = useToast();

  const hasDigitalProduct = items.some(item => item.product.isDigital);

  const handleCheckout = async () => {
    if (hasDigitalProduct && !user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'Please log in to purchase digital items.',
        });
        showLogin();
        return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, accessDuration, userId: user?.id }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || 'Failed to create checkout session');
      }

      if (body.url) {
        router.push(body.url);
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

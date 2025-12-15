
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { orders } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function createOrder() {
      if (sessionId && user && cartItems.length > 0) {
        
        const accessDurationParam = searchParams.get('accessDuration');
        const hasDigitalProduct = cartItems.some(item => item.product.isDigital);
        const accessDuration = accessDurationParam ? parseInt(accessDurationParam) : undefined;
        
        // Use a consistent portion of the session ID for the order ID to prevent duplicates.
        const orderId = sessionId.substring(0, 20); 

        // Check if order already exists
        const existingOrder = orders.find(o => o.id === orderId);

        if (existingOrder) {
          // Order already processed, just ensure cart is clear
          clearCart();
          return;
        }

        const newOrder = {
          id: orderId,
          userId: user.id,
          items: cartItems.map(item => ({
            product: { ...item.product }, // Make sure product is a plain object
            quantity: item.quantity,
          })),
          status: 'Paid' as const,
          date: new Date().toISOString(),
          total: totalPrice,
          ...(hasDigitalProduct && {
              accessDuration: accessDuration,
              linkActivatedAt: new Date().toISOString(),
          })
        };

        try {
          // Add to mock orders array
          orders.push(newOrder); 
          // Clear cart only after successful order creation.
          clearCart();
        } catch (error) {
          console.error("Error creating order:", error);
          toast({
            variant: 'destructive',
            title: 'Order Creation Failed',
            description: 'There was an issue saving your order. Please contact support.',
          });
        }
      }
    }
    
    if (sessionId && user) {
      createOrder();
    }
  }, [sessionId, user, cartItems, totalPrice, searchParams, clearCart, toast]);

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

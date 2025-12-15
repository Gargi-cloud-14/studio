
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { data: user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    async function createOrder() {
      if (sessionId && user && cartItems.length > 0 && firestore) {
        
        const accessDurationParam = searchParams.get('accessDuration');
        const hasDigitalProduct = cartItems.some(item => item.product.isDigital);
        const accessDuration = accessDurationParam ? parseInt(accessDurationParam) : undefined;
        
        // Use a consistent portion of the session ID for the order ID to prevent duplicates.
        const orderId = sessionId.substring(0, 20); 
        const orderRef = doc(firestore, 'orders', orderId);

        const newOrder = {
          id: orderId,
          userId: user.uid,
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
          // Use setDoc with merge:true to create or update, preventing duplicates on page refresh.
          await setDoc(orderRef, newOrder, { merge: true }); 
          // Clear cart only after successful order creation in Firestore.
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
    
    // Only run if we have the necessary data.
    if (sessionId && user && firestore) {
      createOrder();
    }
    // We only clear the cart on success now.
    // The dependency array ensures this effect runs only when these values change.
  }, [sessionId, user, cartItems, totalPrice, searchParams, firestore, clearCart, toast]);

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

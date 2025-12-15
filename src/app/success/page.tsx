
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { data: user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    async function createOrder() {
      if (sessionId && user && cartItems.length > 0 && firestore) {
        
        const accessDurationParam = searchParams.get('accessDuration');
        const hasDigitalProduct = cartItems.some(item => item.product.isDigital);
        const accessDuration = accessDurationParam ? parseInt(accessDurationParam) : undefined;
        
        const orderId = sessionId.substring(0, 20);
        const orderRef = doc(firestore, 'orders', orderId);

        const newOrder = {
          id: orderId,
          userId: user.uid,
          items: cartItems,
          status: 'Paid' as const,
          date: new Date().toISOString(),
          total: totalPrice,
          ...(hasDigitalProduct && {
              accessDuration: accessDuration,
              linkActivatedAt: new Date().toISOString(),
          })
        };

        try {
          // Use setDoc to ensure we don't create duplicate orders on refresh.
          await setDoc(orderRef, newOrder, { merge: true }); 
          // Clear cart only after successful order creation
          clearCart();
        } catch (error) {
          console.error("Error creating order:", error);
          // Optionally, show a toast to the user
        }
      }
    }
    
    createOrder();
    // We only clear the cart on success now.
  }, [sessionId, user, cartItems, totalPrice, searchParams, firestore, clearCart]);

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

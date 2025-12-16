
"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      // We are now handling order creation via webhooks.
      // We can clear the cart on the client-side for a better user experience.
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="font-headline text-4xl mt-6">Payment Successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your purchase. Your order is being processed and will appear in your downloads shortly.
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

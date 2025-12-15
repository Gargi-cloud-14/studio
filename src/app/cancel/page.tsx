import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <XCircle className="mx-auto h-24 w-24 text-red-500" />
      <h1 className="font-headline text-4xl mt-6">Payment Cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        Your order was not processed. You can try again or continue shopping.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link href="/cart">Return to Cart</Link>
        </Button>
         <Button asChild variant="outline">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}


"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { ShippingForm } from '@/components/ShippingForm';
import { CartSummary } from '@/components/CartSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';

export default function CheckoutPage() {
  const { items } = useCart();
  const hasPhysicalProduct = items.some(item => !item.product.isDigital);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-in fade-in-0">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="font-headline text-4xl mt-6">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add items to your cart to proceed to checkout.</p>
        <Button asChild className="mt-6">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <h1 className="font-headline text-4xl mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          {hasPhysicalProduct && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingForm />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                You will be redirected to Stripe to complete your payment securely.
              </p>
              <CheckoutButton />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary isCheckout />
        </div>
      </div>
    </div>
  );
}

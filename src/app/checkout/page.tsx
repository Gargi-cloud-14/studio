
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { ShippingForm } from '@/components/ShippingForm';
import { CartSummary } from '@/components/CartSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Timer } from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CheckoutPage() {
  const { items } = useCart();
  const [accessDuration, setAccessDuration] = useState<string>('86400'); // Default to 24 hours (in seconds)

  const hasPhysicalProduct = items.some(item => !item.product.isDigital);
  const hasDigitalProduct = items.some(item => item.product.isDigital);

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
          {hasDigitalProduct && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <Timer className="mr-3 h-6 w-6 text-primary" />
                  Digital Access Window
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="access-duration">Download Link Expiration</Label>
                  <Select value={accessDuration} onValueChange={setAccessDuration}>
                    <SelectTrigger id="access-duration">
                      <SelectValue placeholder="Select access duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="900">15 Minutes</SelectItem>
                      <SelectItem value="3600">1 Hour</SelectItem>
                      <SelectItem value="86400">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Your download link will expire after the selected time.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
              <CheckoutButton accessDuration={hasDigitalProduct ? parseInt(accessDuration) : undefined} />
            </CardContent>
          </Card>
        </div>
        <div className="lg-col-span-1 sticky top-24">
          <CartSummary isCheckout />
        </div>
      </div>
    </div>
  );
}

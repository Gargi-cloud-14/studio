
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { ShippingForm } from '@/components/ShippingForm';
import { CartSummary } from '@/components/CartSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingBag, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { orders } from '@/lib/data';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const hasPhysicalProduct = items.some(item => !item.product.isDigital);
  const hasDigitalProduct = items.some(item => item.product.isDigital);
  const [accessDuration, setAccessDuration] = useState<string>("900"); // Default 15 minutes (900s)

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

  const handlePlaceOrder = () => {
    // This simulates placing an order and clearing the cart.
    const mockOrderId = `ord_${Date.now()}`;
    const newOrder = {
      id: mockOrderId,
      items: items,
      status: 'Paid' as const,
      date: new Date().toISOString(),
      total: totalPrice,
      linkActivatedAt: hasDigitalProduct ? new Date().toISOString() : undefined,
      accessDuration: hasDigitalProduct ? parseInt(accessDuration) : undefined,
      shippingAddress: hasPhysicalProduct ? {
        name: 'Alex Doe',
        address: '123 Prototype Ave',
        city: 'Nextville',
        state: 'JS',
        zip: '12345'
      } : undefined,
    };
    
    // Add the new order to our mock data.
    orders.unshift(newOrder);

    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. You will be redirected shortly.',
    });
    
    setTimeout(() => {
      clearCart();
      router.push(`/success?orderId=${mockOrderId}`);
    }, 1500);
  };


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
           {hasDigitalProduct && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center">
                  <Clock className="mr-3 h-6 w-6 text-primary" />
                  Digital Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="access-duration">Download Link Expiration</Label>
                  <Select value={accessDuration} onValueChange={setAccessDuration}>
                    <SelectTrigger id="access-duration" className="w-full">
                      <SelectValue placeholder="Select access duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Seconds (Demo)</SelectItem>
                      <SelectItem value="30">30 Seconds (Demo)</SelectItem>
                      <SelectItem value="60">1 Minute (Demo)</SelectItem>
                      <SelectItem value="300">5 Minutes (Demo)</SelectItem>
                    </SelectContent>
                  </Select>
                   <p className="text-sm text-muted-foreground">
                    Choose how long your secure download links will be active after purchase.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">This is where the Stripe payment element would be rendered. For this prototype, click below to simulate a successful payment.</p>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePlaceOrder}>
                <CreditCard className="mr-2 h-5 w-5" />
                Place Your Order
              </Button>
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

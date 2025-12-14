
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { ShippingForm } from '@/components/ShippingForm';
import { CartSummary } from '@/components/CartSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { orders } from '@/lib/data';

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const { toast } = useToast();
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

  const handlePlaceOrder = () => {
    // This simulates placing an order and clearing the cart.
    // In a real app, this logic would live in a Stripe webhook.
    const mockOrderId = `ord_${Date.now()}`;
    const newOrder = {
      id: mockOrderId,
      items: items,
      status: 'Paid' as const,
      date: new Date().toISOString(),
      total: totalPrice,
      // In a real app, shipping address would be collected from the form.
      shippingAddress: hasPhysicalProduct ? {
        name: 'Alex Doe',
        address: '123 Prototype Ave',
        city: 'Nextville',
        state: 'JS',
        zip: '12345'
      } : undefined,
    };
    
    // Add the new order to our mock data.
    // In a real app, this would be a database insert.
    orders.unshift(newOrder);

    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. You will be redirected shortly.',
    });
    
    setTimeout(() => {
      clearCart();
      router.push(`/order-status/${mockOrderId}`);
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

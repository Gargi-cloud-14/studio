
"use client";

import { Suspense } from 'react';
import { useSearchParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { orders, getPlaceholderImage } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';
import type { Order } from '@/lib/types';
import { DownloadItem } from '@/components/DownloadItem';
import { useAuth } from '@/hooks/useAuth';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();
  const { isLoggedIn, showLogin } = useAuth();
  
  if (!orderId) {
    // In a real app, you might want a more graceful fallback.
    return notFound();
  }

  const order = orders.find(o => o.id === orderId) as Order | undefined;

  if (!order) {
    return notFound();
  }
  
  if (!isLoggedIn) {
    // In a real app, you might not get here if checkout requires login.
    // But as a fallback, prompt login to view order.
    return (
        <div className="text-center">
            <h2 className="font-headline text-2xl">Please log in</h2>
            <p className="text-muted-foreground mt-2">You need to be logged in to view your order details.</p>
            <Button onClick={showLogin} className="mt-4">Log In</Button>
        </div>
    )
  }

  const digitalItems = order.items.filter(item => item.product.isDigital);
  const physicalItems = order.items.filter(item => !item.product.isDigital);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="font-headline text-3xl">
            Thank You For Your Order!
          </CardTitle>
          <CardDescription>
            Your order #{order.id} has been placed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {digitalItems.length > 0 && (
            <div>
              <h3 className="font-headline text-xl mb-4">Your Digital Downloads</h3>
              <div className="space-y-4">
                {digitalItems.map(({ product }) => (
                  <DownloadItem key={product.id} product={product} order={order} />
                ))}
              </div>
            </div>
          )}

          {physicalItems.length > 0 && (
            <div>
              <h3 className="font-headline text-xl mb-4">Items Being Shipped</h3>
              <div className="space-y-4 rounded-lg border p-4">
                {physicalItems.map(({ product, quantity }) => {
                  const image = getPlaceholderImage(product.imageId);
                  return (
                    <div key={product.id} className="flex items-center gap-4">
                       <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            sizes="64px"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
               {order.shippingAddress && (
                <div className="mt-4">
                  <h4 className="font-headline text-lg mb-2">Shipping To</h4>
                  <address className="not-italic text-muted-foreground text-sm">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </address>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
            <span className="font-headline text-lg">Order Total</span>
            <span className="font-bold text-2xl text-primary">${order.total.toFixed(2)}</span>
          </div>
          
          <div className="text-center pt-4">
            <Button asChild className="mr-4">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href={`/order-status/${order.id}`}>
                    <Package className="mr-2 h-4 w-4" />
                    View Order Status
                </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}


export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <Suspense fallback={<div className="text-center">Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}


import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { orders, getPlaceholderImage } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import type { Order } from '@/lib/types';

const statusMap = {
  Paid: { icon: CheckCircle, text: 'Order Paid', description: 'Your payment was successful.' },
  Processing: { icon: Package, text: 'Processing', description: 'We are preparing your order.' },
  Shipped: { icon: Truck, text: 'Shipped', description: 'Your order is on its way.' },
  Delivered: { icon: Home, text: 'Delivered', description: 'Your order has arrived.' },
  Cancelled: { icon: CheckCircle, text: 'Cancelled', description: 'Your order has been cancelled.' },
};

export default function OrderStatusPage({ params }: { params: { orderId: string } }) {
  const order = orders.find(o => o.id === params.orderId) as Order | undefined;

  if (!order) {
    notFound();
  }

  const CurrentStatusIcon = statusMap[order.status].icon;

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CurrentStatusIcon className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="font-headline text-3xl">
              {statusMap[order.status].text}
            </CardTitle>
            <CardDescription>
              Order #{order.id} &bull; Placed on {new Date(order.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="my-6" />

            <h3 className="font-headline text-xl mb-4">Items in this order</h3>
            <div className="space-y-4">
              {order.items.map(({ product, quantity }) => {
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

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-headline text-xl mb-2">Order Total</h3>
                <p className="font-bold text-2xl text-primary">${order.total.toFixed(2)}</p>
              </div>
              {order.shippingAddress && (
                <div>
                  <h3 className="font-headline text-xl mb-2">Shipping To</h3>
                  <address className="not-italic text-muted-foreground">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </address>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

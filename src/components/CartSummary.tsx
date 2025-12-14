"use client";

import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { getPlaceholderImage } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function CartSummary({ isCheckout = false }: { isCheckout?: boolean }) {
  const { items, totalPrice } = useCart();
  const taxRate = 0.08;
  const shipping = isCheckout && items.some(item => !item.product.isDigital) ? 10.00 : 0;
  const taxes = totalPrice * taxRate;
  const finalTotal = totalPrice + taxes + shipping;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {items.map(({ product, quantity }) => {
            const image = getPlaceholderImage(product.imageId);
            return (
              <div key={product.id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center z-10">
                    {quantity}
                  </div>
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
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                </div>
                <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
              </div>
            );
          })}
        </div>
        <Separator />
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          {shipping > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

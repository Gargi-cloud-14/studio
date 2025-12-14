"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { getPlaceholderImage } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const taxRate = 0.08; // 8% tax
  const taxes = totalPrice * taxRate;
  const finalTotal = totalPrice + taxes;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-in fade-in-0">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="font-headline text-4xl mt-6">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <h1 className="font-headline text-4xl mb-8">Your Cart ({totalItems})</h1>
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const image = getPlaceholderImage(product.imageId);
            return (
              <Card key={product.id} className="flex items-center p-4">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      sizes="96px"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <Link href={`/products/${product.id}`} className="font-headline text-lg hover:text-primary transition-colors">{product.name}</Link>
                  <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                    className="w-16 text-center"
                    aria-label={`Quantity for ${product.name}`}
                  />
                   <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)} aria-label={`Remove ${product.name} from cart`}>
                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes ({(taxRate * 100).toFixed(0)}%)</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

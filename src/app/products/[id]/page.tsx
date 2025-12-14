"use client";

import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { products, getPlaceholderImage } from '@/lib/data';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const image = getPlaceholderImage(product.imageId);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0 duration-500">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden shadow-lg">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={image.imageHint}
              priority
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Badge variant={product.isDigital ? 'secondary' : 'outline'} className="w-fit">
            {product.isDigital ? 'Digital Product' : 'Physical Good'}
          </Badge>
          <h1 className="font-headline text-4xl lg:text-5xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground text-lg">{product.description}</p>
          <Separator />
          <div>
             <h2 className="font-headline text-xl mb-2">Specifications</h2>
             <ul className="space-y-1 text-muted-foreground">
                 {Object.entries(product.specs).map(([key, value]) => (
                     <li key={key}>
                         <span className="font-semibold text-foreground">{key}:</span> {value}
                     </li>
                 ))}
             </ul>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => addToCart(product)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

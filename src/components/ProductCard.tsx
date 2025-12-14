import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = getPlaceholderImage(product.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block aspect-[3/2] relative">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={image.imageHint}
            />
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-headline leading-tight">
                <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
            </CardTitle>
            <Badge variant={product.isDigital ? 'secondary' : 'outline'}>{product.isDigital ? 'Digital' : 'Physical'}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Button asChild variant="ghost" size="sm">
            <Link href={`/products/${product.id}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

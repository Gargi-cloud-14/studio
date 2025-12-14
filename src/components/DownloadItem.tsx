import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DownloadItemProps {
  product: Product;
}

export function DownloadItem({ product }: DownloadItemProps) {
  const image = getPlaceholderImage(product.imageId);

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <div>
            <h3 className="font-headline text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">License for personal and commercial use.</p>
          </div>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
}

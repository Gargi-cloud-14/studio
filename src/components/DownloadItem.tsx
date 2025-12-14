
"use client";

import React from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/data';
import type { Product, Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lock, RefreshCw, AlertTriangle, Timer } from 'lucide-react';
import { useDownloadTimer } from '@/hooks/useDownloadTimer';

interface DownloadItemProps {
  product: Product;
  order: Order;
}

export function DownloadItem({ product, order }: DownloadItemProps) {
  const image = getPlaceholderImage(product.imageId);
  const { timeRemaining, isExpired, isGenerating, generateLink, download } = useDownloadTimer(order);

  const isPaid = order.status === 'Paid';

  const renderButton = () => {
    if (!isPaid) {
      return (
        <Button disabled variant="outline">
          <Lock className="mr-2 h-4 w-4" />
          Awaiting Payment
        </Button>
      );
    }
    
    if (isGenerating) {
        return (
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </Button>
        );
    }

    if(isExpired) {
        return (
            <Button disabled variant="secondary">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Link Expired
            </Button>
        );
    }
    
    if (timeRemaining === null) {
      return (
        <Button onClick={generateLink} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Generate Link
        </Button>
      );
    }

    return (
        <Button onClick={download}>
            <Download className="mr-2 h-4 w-4" />
            Download Now
        </Button>
    )

  };

  const renderTimer = () => {
    if (isPaid && !isExpired && timeRemaining !== null && !isGenerating) {
      const { minutes, seconds } = timeRemaining;
      return (
        <div className="flex items-center text-sm text-amber-600 font-mono">
            <Timer className="mr-1.5 h-4 w-4" />
            <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
        </div>
      )
    }
    return null;
  }

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
            <p className="text-sm text-muted-foreground">Order #{order.id} &bull; Status: {order.status}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            {renderButton()}
            {renderTimer()}
        </div>
      </CardContent>
    </Card>
  );
}

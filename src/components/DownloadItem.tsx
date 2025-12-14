
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/data';
import type { Product, Order } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Lock, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadItemProps {
  product: Product;
  order: Order;
}

const LINK_EXPIRATION_SECONDS = 15; // Set to 15s for demo purposes

export function DownloadItem({ product, order }: DownloadItemProps) {
  const image = getPlaceholderImage(product.imageId);
  const { toast } = useToast();
  
  const [downloadState, setDownloadState] = useState<'idle' | 'generating' | 'ready' | 'expired'>('idle');
  const [countdown, setCountdown] = useState(LINK_EXPIRATION_SECONDS);

  const isPaid = order.status === 'Paid';

  const getSecureLink = useCallback(() => {
    if (!isPaid) {
      toast({
        variant: "destructive",
        title: "Order Not Paid",
        description: "This item is not available for download yet.",
      });
      return;
    }
    
    setDownloadState('generating');
    toast({
      title: "Generating Secure Link...",
      description: "Your download will be ready shortly.",
    });

    // Simulate API call to generate a secure, temporary link
    setTimeout(() => {
      setDownloadState('ready');
      setCountdown(LINK_EXPIRATION_SECONDS);
    }, 1500);
  }, [isPaid, toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (downloadState === 'ready' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && downloadState === 'ready') {
      setDownloadState('expired');
      toast({
        variant: "destructive",
        title: "Download Link Expired",
        description: "Please generate a new link to download your file.",
      });
    }
    return () => clearTimeout(timer);
  }, [downloadState, countdown, toast]);

  const handleDownload = () => {
    if (downloadState !== 'ready') return;
    toast({
      title: "Download Started!",
      description: `Downloading ${product.name}.`,
    });
    // In a real app, this would trigger a file download from the secure link.
  };

  const renderButton = () => {
    if (!isPaid) {
      return (
        <Button disabled variant="outline">
          <Lock className="mr-2 h-4 w-4" />
          Awaiting Payment
        </Button>
      );
    }

    switch (downloadState) {
      case 'idle':
        return (
          <Button onClick={getSecureLink} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Generate Link
          </Button>
        );
      case 'generating':
        return (
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </Button>
        );
      case 'ready':
        return (
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Now ({countdown}s)
          </Button>
        );
      case 'expired':
        return (
          <Button onClick={getSecureLink} variant="secondary">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Link Expired, Regenerate
          </Button>
        );
    }
  };

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
        {renderButton()}
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';

interface TimeRemaining {
  minutes: number;
  seconds: number;
}

export function useDownloadTimer(order: Order) {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (!order.linkActivatedAt || !order.accessDuration) {
      return null;
    }

    const activationTime = new Date(order.linkActivatedAt).getTime();
    const expirationTime = activationTime + order.accessDuration * 1000;
    const now = Date.now();
    const remaining = expirationTime - now;

    if (remaining <= 0) {
      setIsExpired(true);
      setTimeRemaining(null);
      return null;
    }

    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    return { minutes, seconds };
  }, [order.linkActivatedAt, order.accessDuration]);


  useEffect(() => {
    // Immediately check the state on mount
    const remaining = calculateTimeRemaining();
    if (remaining) {
      setTimeRemaining(remaining);
    } else {
        // if linkActivatedAt is present, it means the timer has started
        if (order.linkActivatedAt) {
            setIsExpired(true);
        }
    }

    // Set up an interval to update the timer
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      if (remaining) {
        setTimeRemaining(remaining);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order, calculateTimeRemaining]);
  
  const download = useCallback(() => {
    if (isExpired) {
        toast({
            variant: 'destructive',
            title: 'Link Expired',
            description: 'Please purchase a new download link.'
        })
        return;
    }
    toast({
      title: "Download Started!",
      description: `Downloading...`,
    });
    // In a real app, this would trigger a file download from the secure link.
  }, [isExpired, toast]);

  return {
    timeRemaining,
    isExpired,
    download
  };
}

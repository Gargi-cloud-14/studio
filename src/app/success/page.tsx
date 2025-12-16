
"use client";

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, AlertTriangle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DigitalProduct {
    id: string;
    name: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const sessionId = searchParams.get('session_id');
  const duration = searchParams.get('duration');
  const digitalProductsParam = searchParams.get('digital_products');

  const digitalProducts = useMemo(() => {
    try {
        return digitalProductsParam ? JSON.parse(digitalProductsParam) as DigitalProduct[] : [];
    } catch (e) {
        return [];
    }
  }, [digitalProductsParam]);

  const hasDigitalProducts = digitalProducts.length > 0 && duration;

  const [timeLeft, setTimeLeft] = useState(duration ? parseInt(duration, 10) : 0);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  useEffect(() => {
    if (!hasDigitalProducts) return;

    if (timeLeft <= 0) {
      setTimeout(() => {
        router.push('/');
      }, 2000); // Wait 2 seconds before redirecting
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, hasDigitalProducts, router]);


  const handleDownload = () => {
    // In a real app, this would trigger the file download.
    // For this prototype, we'll just log it.
    console.log('Downloading products:', digitalProducts);
    // Optionally redirect after download
    // router.push('/');
  }

  const isExpired = hasDigitalProducts && timeLeft <= 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / parseInt(duration || '1', 10)) * 100;

  if (hasDigitalProducts) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-lg text-center animate-in fade-in-0 duration-500">
          <CardHeader>
             {isExpired ? (
                 <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
             ) : (
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
             )}
            <CardTitle className="font-headline text-3xl">
              {isExpired ? 'Download Link Expired' : 'Your Download is Ready!'}
            </CardTitle>
            <CardDescription>
              {isExpired
                ? 'Your one-time download window has closed. Redirecting...'
                : 'Thank you for your purchase! Your download link is available for a limited time.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                {digitalProducts.map(p => <p key={p.id} className="font-semibold">{p.name}</p>)}
            </div>

            <div className="space-y-3">
              <Button onClick={handleDownload} disabled={isExpired} size="lg" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                {isExpired ? 'Expired' : 'Download Now'}
              </Button>
               <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span className="font-mono text-base">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                    <Progress value={progress} className="h-2 flex-grow" />
               </div>
            </div>
            
            <p className="text-xs text-muted-foreground pt-4">
              This is a one-time download link. Please save your file in a safe place.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default success page for non-digital orders
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
      <h1 className="font-headline text-4xl mt-6">Payment Successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for your purchase. We've received your order and are getting it ready.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

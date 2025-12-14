
"use client";

import { useAuth } from '@/hooks/useAuth';
import { orders } from '@/lib/data';
import { DownloadItem } from '@/components/DownloadItem';
import { Button } from '@/components/ui/button';
import { DownloadCloud, UserX } from 'lucide-react';
import type { CartItem, Order } from '@/lib/types';

interface DigitalItemEntry {
  product: CartItem['product'];
  order: Order;
}

export default function DownloadsPage() {
  const { isLoggedIn, user, showLogin } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <UserX className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="font-headline text-4xl mt-6">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">Please log in to view your digital downloads.</p>
        <Button onClick={showLogin} className="mt-6">
          Log In
        </Button>
      </div>
    );
  }

  // Filter orders that belong to the "logged-in" user.
  // Then, from those orders, get all digital items.
  const userOrders = orders; // In a real app, you would filter by user.id
  
  const digitalItems: DigitalItemEntry[] = userOrders.flatMap(order => 
    order.items
      .filter(item => item.product.isDigital)
      .map(item => ({ product: item.product, order }))
  );

  // In this prototype, we'll show every purchased instance.
  // A real app might unique-ify by product ID if desired.

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl">My Downloads</h1>
          <p className="mt-2 text-muted-foreground">
            Hi {user?.name}, here are your purchased digital assets.
          </p>
        </div>

        {digitalItems.length > 0 ? (
          <div className="space-y-4">
            {digitalItems.map(({ product, order }) => (
              <DownloadItem key={`${order.id}-${product.id}`} product={product} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center border-2 border-dashed rounded-lg p-12">
            <DownloadCloud className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="font-headline text-2xl mt-6">No Downloads Yet</h2>
            <p className="mt-2 text-muted-foreground">
              Your purchased digital items will appear here once your order is complete.
            </p>
            <Button asChild className="mt-6">
              <a href="/">Explore Digital Products</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

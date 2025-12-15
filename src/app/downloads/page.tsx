
"use client";

import { useState, useEffect } from 'react';
import { DownloadItem } from '@/components/DownloadItem';
import { Button } from '@/components/ui/button';
import { DownloadCloud, UserX, Loader2 } from 'lucide-react';
import type { CartItem, Order } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { orders as allOrders } from '@/lib/data';

interface DigitalItemEntry {
  product: CartItem['product'];
  order: Order;
}

export default function DownloadsPage() {
  const { user, showLogin, loading: userLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setOrders(allOrders.filter(o => o.userId === user.id));
    } else {
      setOrders([]);
    }
    setOrdersLoading(false);
  }, [user]);

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Loader2 className="mx-auto h-24 w-24 animate-spin text-muted-foreground" />
        <h1 className="font-headline text-4xl mt-6">Loading...</h1>
      </div>
    );
  }

  if (!user) {
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

  const digitalItems: DigitalItemEntry[] = orders.flatMap(order => 
    order.items
      .filter(item => item.product.isDigital)
      .map(item => ({ product: item.product, order }))
  );

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in-0">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl">My Downloads</h1>
          <p className="mt-2 text-muted-foreground">
            Hi {user?.name || 'there'}, here are your purchased digital assets.
          </p>
        </div>

        {ordersLoading && <div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /></div>}

        {!ordersLoading && digitalItems.length > 0 ? (
          <div className="space-y-4">
            {digitalItems.map(({ product, order }) => (
              <DownloadItem key={`${order.id}-${product.id}`} product={product} order={order} />
            ))}
          </div>
        ) : !ordersLoading && (
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

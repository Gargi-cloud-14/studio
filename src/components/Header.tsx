
"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Logo } from '@/components/icons';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold">
          <Logo className="h-6 w-6 text-primary" />
          <span>Pixel & Forge</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Cart">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </Button>
          <ThemeToggle />
          <UserNav />
        </nav>
      </div>
    </header>
  );
}

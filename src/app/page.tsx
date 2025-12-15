import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { getPlaceholderImage } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function Home() {
  const heroImage = getPlaceholderImage('hero-image');

  return (
    <div className="animate-in fade-in-0 duration-500">
      <section className="relative w-full h-[60vh] text-white">
        <div className="absolute inset-0 bg-primary/40 z-10" />
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
            Pixel & Forge
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
            Curated digital assets and handcrafted physical goods for the modern creator.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#products">Explore Collection</Link>
          </Button>
        </div>
      </section>

      <section id="products" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center mb-12">Our Wares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

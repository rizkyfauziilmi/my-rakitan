'use client';

import { useState } from 'react';
import { ArrowRight, Cpu, Headphones, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { productENUM, ProductType } from '@/server/db/schema';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/server/trpc/client';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

export function ComponentsAccessoriesSection() {
  const [activeCategory, setActiveCategory] = useState<ProductType>('component');
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery(
    trpc.product.getByType.queryOptions({
      type: activeCategory,
      limit: 15,
      isPopular: true,
    })
  );

  const productTypes = productENUM.enumValues.map((type) => {
    let icon;
    let name;
    switch (type) {
      case 'component':
        icon = <Cpu />;
        name = 'Komponen';
        break;
      case 'accessory':
        icon = <Headphones />;
        name = 'Aksesori';
        break;
      default:
        icon = <></>;
        name = type;
    }
    return { type, icon, name };
  });

  return (
    <section className="min-h-screen">
      {/* Header */}
      <div className="mb-16 text-center">
        <Badge className="mb-2 scale-125">1000+ Komponen</Badge>
        <h2 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
          Komponen & Aksesori
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Jelajahi katalog lengkap komponen PC premium kami. Temukan bagian yang sempurna untuk
          setiap rakitan atau peningkatan.
        </p>
      </div>

      {/* Type Buttons */}
      <div className="mb-2 flex items-center justify-center gap-2">
        {productTypes.map((category) => (
          <Button
            key={category.type}
            onClick={() => {
              setActiveCategory(category.type);
            }}
            className={`relative flex shrink-0 items-center gap-2 rounded-lg px-6 py-3 font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === category.type
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card text-muted-foreground hover:bg-secondary border-border border'
            }`}
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {isLoading || error ? (
        <div>Loading...</div>
      ) : data ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 1500,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {data.map((product) => (
              <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/4">
                <Item key={product.id} variant="outline">
                  <ItemHeader>
                    <Image
                      src={product.imageUrl ?? ''}
                      alt={product.name}
                      width={128}
                      height={128}
                      className="aspect-square w-full rounded-sm object-cover"
                    />
                  </ItemHeader>
                  <ItemContent>
                    <ItemTitle className="line-clamp-1">{product.name}</ItemTitle>
                    <ItemDescription>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(product.price)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemContent className="text-right">
                    <ItemDescription className="text-xs">
                      Sisa stock: {product.stock ?? 0}
                    </ItemDescription>
                    <ItemDescription className="text-xs">
                      Terjual: {product.sold ?? 0}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="w-full">
                    <Button className="w-full" disabled={product.stock === 0}>
                      <ShoppingCart />
                      {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                    </Button>
                  </ItemActions>
                </Item>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div>Tidak ada produk ditemukan.</div>
      )}

      {/* Stats Section */}
      <div className="mt-8 mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '1000+', value: 'Komponen Tersedia' },
          { label: '100%', value: 'Asli & Terverifikasi' },
          { label: '24/7', value: 'Dukungan Pelanggan' },
          { label: '2 Hari', value: 'Pengiriman Tersedia' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-card border-border hover:border-primary/50 rounded-lg border p-6 text-center transition-colors"
          >
            <p className="text-primary mb-1 text-2xl font-bold">{stat.label}</p>
            <p className="text-muted-foreground text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/komponen">
            Cari Semua Komponen <ArrowRight />
          </Link>
        </Button>
        <Button size="lg" variant="outline">
          Lihat Panduan Belanja
        </Button>
      </div>
    </section>
  );
}

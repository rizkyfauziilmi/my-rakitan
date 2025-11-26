'use client';

import { useState } from 'react';
import type React from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HardDrive,
  Monitor,
  Mouse,
  Headphones,
  Keyboard,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: {
    image: string;
    name: string;
    spec: string;
    price: number;
  }[];
}

const componentCategories: ComponentCategory[] = [
  {
    id: 'gpu',
    name: 'Graphics Cards',
    icon: <Monitor className="h-6 w-6" />,
    items: [
      {
        image: '/images/gpu/rtx4090.jpg',
        name: 'RTX 4090',
        spec: '24GB GDDR6X',
        price: 27000000,
      },
      {
        image: '/images/gpu/rtx4080.jpg',
        name: 'RTX 4080',
        spec: '16GB GDDR6X',
        price: 20000000,
      },
      {
        image: '/images/gpu/rtx4070ti.jpg',
        name: 'RTX 4070 Ti',
        spec: '12GB GDDR6X',
        price: 14000000,
      },
      {
        image: '/images/gpu/rtx4060.jpg',
        name: 'RTX 4060',
        spec: '8GB GDDR6',
        price: 8000000,
      },
    ],
  },
  {
    id: 'cpu',
    name: 'Processors',
    icon: <Cpu className="h-6 w-6" />,
    items: [
      {
        image: '/images/cpu/intel-i9-13900k.jpg',
        name: 'Intel i9-13900K',
        spec: '24 Core',
        price: 9000000,
      },
      {
        image: '/images/cpu/amd-ryzen-9-7950x.jpg',
        name: 'AMD Ryzen 9 7950X',
        spec: '16 Core',
        price: 8500000,
      },
      {
        image: '/images/cpu/intel-i7-13700k.jpg',
        name: 'Intel i7-13700K',
        spec: '16 Core',
        price: 6500000,
      },
      {
        image: '/images/cpu/amd-ryzen-7-7700x.jpg',
        name: 'AMD Ryzen 7 7700X',
        spec: '8 Core',
        price: 4500000,
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory & Storage',
    icon: <HardDrive className="h-6 w-6" />,
    items: [
      {
        image: '/images/memory/ddr5-64gb.jpg',
        name: 'DDR5 64GB',
        spec: '6000MHz',
        price: 9500000,
      },
      {
        image: '/images/memory/ddr5-32gb.jpg',
        name: 'DDR5 32GB',
        spec: '5600MHz',
        price: 4800000,
      },
      {
        image: '/images/memory/nvme-2tb.jpg',
        name: '2TB NVMe SSD',
        spec: '7400MB/s',
        price: 3200000,
      },
      {
        image: '/images/memory/sata-ssd-1tb.jpg',
        name: '1TB SATA SSD',
        spec: '550MB/s',
        price: 1200000,
      },
    ],
  },
  {
    id: 'mouse',
    name: 'Mouse',
    icon: <Mouse className="h-6 w-6" />,
    items: [
      {
        image: '/images/mouse/logitech-mx-master-3.jpg',
        name: 'Logitech MX Master 3',
        spec: 'Wireless, Ergonomic',
        price: 2000000,
      },
      {
        image: '/images/mouse/razer-deathadder-v2.jpg',
        name: 'Razer DeathAdder V2',
        spec: 'Wired, 20K DPI',
        price: 1000000,
      },
      {
        image: '/images/mouse/steelseries-rival-3.jpg',
        name: 'SteelSeries Rival 3',
        spec: 'Wired, RGB',
        price: 500000,
      },
      {
        image: '/images/mouse/asus-rog-gladius-iii.jpg',
        name: 'ASUS ROG Gladius III',
        spec: 'Wireless, RGB',
        price: 2500000,
      },
    ],
  },
  {
    id: 'headphones',
    name: 'Headphones',
    icon: <Headphones className="h-6 w-6" />,
    items: [
      {
        image: '/images/headphones/sony-wh-1000xm5.jpg',
        name: 'Sony WH-1000XM5',
        spec: 'Wireless, Noise Cancelling',
        price: 4500000,
      },
      {
        image: '/images/headphones/bose-700.jpg',
        name: 'Bose 700',
        spec: 'Wireless, Noise Cancelling',
        price: 5500000,
      },
      {
        image: '/images/headphones/hyperx-cloud-ii.jpg',
        name: 'HyperX Cloud II',
        spec: 'Wired, Gaming',
        price: 1200000,
      },
      {
        image: '/images/headphones/logitech-g733.jpg',
        name: 'Logitech G733',
        spec: 'Wireless, Gaming',
        price: 2300000,
      },
    ],
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    icon: <Keyboard className="h-6 w-6" />,
    items: [
      {
        image: '/images/keyboard/keychron-k6.jpg',
        name: 'Keychron K6',
        spec: 'Nirkabel, Mekanis',
        price: 1400000,
      },
      {
        image: '/images/keyboard/corsair-k95-rgb.jpg',
        name: 'Corsair K95 RGB',
        spec: 'Kabel, Mekanis',
        price: 3000000,
      },
      {
        image: '/images/keyboard/logitech-g-pro.jpg',
        name: 'Logitech G Pro',
        spec: 'Kabel, TKL',
        price: 2000000,
      },
      {
        image: '/images/keyboard/razer-huntsman-v2.jpg',
        name: 'Razer Huntsman V2',
        spec: 'Kabel, Mekanis',
        price: 3500000,
      },
    ],
  },
];

export function ComponentsAccessoriesSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const currentCategory = componentCategories[activeCategory];
  const nextProduct = () => {
    setCarouselIndex((prev) => (prev + 1) % currentCategory.items.length);
  };
  const prevProduct = () => {
    setCarouselIndex(
      (prev) => (prev - 1 + currentCategory.items.length) % currentCategory.items.length
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="bg-primary/20 absolute inset-0 rounded-full opacity-10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
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

        {/* Category Buttons with Scroll */}
        <div className="mb-16">
          <div className="mb-8 flex flex-wrap justify-center gap-3 pb-4">
            {componentCategories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => {
                  setActiveCategory(index);
                  setCarouselIndex(0);
                }}
                className={`relative flex shrink-0 items-center gap-2 rounded-lg px-6 py-3 font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-muted-foreground hover:bg-secondary border-border border'
                }`}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Product Cards with Interactive Selection */}
          <div className="relative">
            <ItemGroup className="grid grid-cols-4 gap-4">
              {currentCategory.items.map((item, index) => (
                // <Button
                //   key={index}
                //   onClick={() => setCarouselIndex(index)}
                //   className={`p-6 rounded-lg border-2 transition-all duration-300 transform text-left ${
                //     index === carouselIndex
                //       ? "border-primary bg-primary/5 scale-105 shadow-lg"
                //       : "border-border bg-card opacity-60 hover:opacity-80"
                //   }`}
                // >
                //   <div className="h-20 rounded-lg bg-primary/10 flex items-center justify-center mb-4" />
                //   <h4 className="font-semibold mb-2">{item.name}</h4>
                //   <p className="text-sm text-muted-foreground mb-4">
                //     {item.spec}
                //   </p>
                //   <p className="text-lg font-bold text-primary">
                //     {new Intl.NumberFormat("id-ID", {
                //       style: "currency",
                //       currency: "IDR",
                //     }).format(item.price)}
                //   </p>
                // </Button>
                <Item
                  key={item.name}
                  variant="outline"
                  onClick={() => setCarouselIndex(index)}
                  className={cn(
                    index === carouselIndex ? 'border-primary scale-105 border-2 shadow-lg' : '',
                    'cursor-pointer transition-all hover:shadow-md'
                  )}
                >
                  <ItemHeader>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="aspect-square w-full rounded-sm object-cover"
                    />
                  </ItemHeader>
                  <ItemContent>
                    <ItemTitle>{item.name}</ItemTitle>
                    <ItemDescription>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      }).format(item.price)}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="w-full">
                    <Button className="w-full">
                      Tambah ke Keranjang
                      <ShoppingCart />
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>

            {/* Navigation Controls */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={prevProduct}
                className="bg-card border-border hover:bg-secondary rounded-full border p-3 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {currentCategory.items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === carouselIndex ? 'bg-primary w-8' : 'bg-border w-2'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextProduct}
                className="bg-card border-border hover:bg-secondary rounded-full border p-3 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import type React from 'react';
import { Gamepad2, Zap, PenTool, Check, ShoppingCart, Bot, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PrebuiltCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  price: number;
}

const categories: PrebuiltCategory[] = [
  {
    id: 'gaming',
    name: 'PC Gaming',
    icon: <Gamepad2 className="h-8 w-8" />,
    tagline: 'Kuasai Setiap Permainan',
    description:
      'Rasakan frame rate yang sangat mulus pada 1440p dan 4K dengan kartu grafis dan prosesor kelas atas.',
    specs: [
      { label: 'GPU', value: 'RTX 4070 Ti' },
      { label: 'CPU', value: 'Intel i9-13900K' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Storage', value: '1TB NVMe SSD' },
    ],
    features: ['High-refresh 1440p/4K gaming', 'Advanced cooling', 'RGB lighting', 'VR-ready'],
    price: 25000000,
  },
  {
    id: 'workstation',
    name: 'PC Workstation',
    icon: <Zap className="h-8 w-8" />,
    tagline: 'Kekuatan Profesional',
    description:
      'Dirancang untuk pengeditan video, rendering 3D, CAD, dan simulasi kompleks tanpa kompromi.',
    specs: [
      { label: 'GPU', value: 'RTX 6000 Ada' },
      { label: 'CPU', value: 'AMD Ryzen 9' },
      { label: 'RAM', value: '64GB DDR5' },
      { label: 'Storage', value: '2TB NVMe SSD' },
    ],
    features: [
      'ECC memory support',
      'Professional drivers',
      'Dual PSU capable',
      'Thermal optimized',
    ],
    price: 45000000,
  },
  {
    id: 'design',
    name: 'Desain & Grafis',
    icon: <PenTool className="h-8 w-8" />,
    tagline: 'Presisi & Kreativitas',
    description:
      'Sistem dengan akurasi warna yang sempurna untuk desain grafis, fotografi, dan pembuatan konten kreatif.',
    specs: [
      { label: 'GPU', value: 'RTX 4060 Ti' },
      { label: 'CPU', value: 'Intel i7-13700' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Storage', value: '1TB NVMe SSD' },
    ],
    features: [
      'Factory calibrated display',
      'Color-accurate GPU',
      'Silent operation',
      'Compact design',
    ],
    price: 20000000,
  },
  {
    id: 'ai',
    name: 'AI & Pembelajaran Mesin',
    icon: <Bot className="h-8 w-8" />,
    tagline: 'Kecerdasan Tanpa Batas',
    description:
      'Dioptimalkan untuk pengembangan AI, pembelajaran mendalam, dan beban kerja ilmu data dengan perangkat keras mutakhir.',
    specs: [
      { label: 'GPU', value: 'NVIDIA A100' },
      { label: 'CPU', value: 'AMD EPYC 7763' },
      { label: 'RAM', value: '128GB DDR4 ECC' },
      { label: 'Storage', value: '4TB NVMe SSD' },
    ],
    features: [
      'Multi-GPU support',
      'High-speed networking',
      'Optimized for TensorFlow/PyTorch',
      'Enterprise-grade reliability',
    ],
    price: 120000000,
  },
];

export function PrebuiltPCSection() {
  const [activeCategory, setActiveCategory] = useState('gaming');
  const activeConfig = categories.find((c) => c.id === activeCategory)!;

  return (
    <section className="overflow-hidden">
      {/* Header */}
      <div className="mb-16 text-center">
        <Badge className="mb-2 scale-125">🌟 PC Rakitan Siap Pakai</Badge>
        <h2 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
          PC Siap Pakai
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Pilih kategori Anda dan jelajahi sistem yang dikonfigurasi oleh ahli. Setiap unit dirakit,
          diuji, dan dioptimalkan untuk performa terbaik.
        </p>
      </div>

      {/* Category Tabs with Toggle Animation */}
      <div className="mb-12 flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              activeCategory === category.id
                ? 'bg-accent text-accent-foreground scale-105 shadow-lg'
                : 'bg-card text-muted-foreground hover:bg-secondary border-border border'
            )}
            size="lg"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
        <Button size="lg" asChild>
          <Link href="/pc-rakitan">
            Lihat Semua PC Rakitan <MoveRight />
          </Link>
        </Button>
      </div>

      {/* Active Category Display with Animated Transition */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Side - Specs & Features */}
        <div className="animate-in fade-in space-y-8 duration-300">
          <div>
            <p className="text-primary mb-2 text-sm font-semibold">{activeConfig.tagline}</p>
            <h3 className="mb-4 text-3xl font-bold">{activeConfig.name}</h3>
            <p className="text-muted-foreground text-lg">{activeConfig.description}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            {activeConfig.specs.map((spec, index) => (
              <div
                key={index}
                className="bg-card border-border hover:border-primary/50 rounded-lg border p-4 transition-colors"
              >
                <p className="text-muted-foreground text-xs tracking-wider uppercase">
                  {spec.label}
                </p>
                <p className="text-primary mt-1 text-lg font-semibold">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Fitur Utama
            </p>
            <ul className="space-y-2">
              {activeConfig.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check className="text-primary h-4 w-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border border-t pt-4">
            <p className="text-primary text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(activeConfig.price)}
            </p>
          </div>
        </div>

        {/* Right Side - Visual Showcase */}
        <div className="relative">
          <div className="border-border bg-card/50 group hover:border-accent/50 relative flex h-96 items-center justify-center overflow-hidden rounded-xl border-2 p-8 transition-colors">
            <div className="relative z-10 space-y-4 text-center">
              <div className="bg-accent text-accent-foreground mx-auto flex h-40 w-40 animate-bounce items-center justify-center rounded-lg">
                {activeConfig.icon}
              </div>
              <p className="text-sm font-semibold">{activeConfig.name}</p>
              <p className="text-muted-foreground text-xs">Klik untuk melihat di toko</p>
            </div>
          </div>

          <Button size="lg" className="mt-8 w-full">
            Tambahkan ke Keranjang <ShoppingCart />
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import type React from "react";
import { Gamepad2, Zap, PenTool, Check, ShoppingCart, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    id: "gaming",
    name: "PC Gaming",
    icon: <Gamepad2 className="h-8 w-8" />,
    tagline: "Kuasai Setiap Permainan",
    description:
      "Rasakan frame rate yang sangat mulus pada 1440p dan 4K dengan kartu grafis dan prosesor kelas atas.",
    specs: [
      { label: "GPU", value: "RTX 4070 Ti" },
      { label: "CPU", value: "Intel i9-13900K" },
      { label: "RAM", value: "32GB DDR5" },
      { label: "Storage", value: "1TB NVMe SSD" },
    ],
    features: [
      "High-refresh 1440p/4K gaming",
      "Advanced cooling",
      "RGB lighting",
      "VR-ready",
    ],
    price: 25000000,
  },
  {
    id: "workstation",
    name: "PC Workstation",
    icon: <Zap className="h-8 w-8" />,
    tagline: "Kekuatan Profesional",
    description:
      "Dirancang untuk pengeditan video, rendering 3D, CAD, dan simulasi kompleks tanpa kompromi.",
    specs: [
      { label: "GPU", value: "RTX 6000 Ada" },
      { label: "CPU", value: "AMD Ryzen 9" },
      { label: "RAM", value: "64GB DDR5" },
      { label: "Storage", value: "2TB NVMe SSD" },
    ],
    features: [
      "ECC memory support",
      "Professional drivers",
      "Dual PSU capable",
      "Thermal optimized",
    ],
    price: 45000000,
  },
  {
    id: "design",
    name: "Desain & Grafis",
    icon: <PenTool className="h-8 w-8" />,
    tagline: "Presisi & Kreativitas",
    description:
      "Sistem dengan akurasi warna yang sempurna untuk desain grafis, fotografi, dan pembuatan konten kreatif.",
    specs: [
      { label: "GPU", value: "RTX 4060 Ti" },
      { label: "CPU", value: "Intel i7-13700" },
      { label: "RAM", value: "32GB DDR5" },
      { label: "Storage", value: "1TB NVMe SSD" },
    ],
    features: [
      "Factory calibrated display",
      "Color-accurate GPU",
      "Silent operation",
      "Compact design",
    ],
    price: 20000000,
  },
  {
    id: "ai",
    name: "AI & Pembelajaran Mesin",
    icon: <Bot className="h-8 w-8" />,
    tagline: "Kecerdasan Tanpa Batas",
    description:
      "Dioptimalkan untuk pengembangan AI, pembelajaran mendalam, dan beban kerja ilmu data dengan perangkat keras mutakhir.",
    specs: [
      { label: "GPU", value: "NVIDIA A100" },
      { label: "CPU", value: "AMD EPYC 7763" },
      { label: "RAM", value: "128GB DDR4 ECC" },
      { label: "Storage", value: "4TB NVMe SSD" },
    ],
    features: [
      "Multi-GPU support",
      "High-speed networking",
      "Optimized for TensorFlow/PyTorch",
      "Enterprise-grade reliability",
    ],
    price: 120000000,
  },
];

export function PrebuiltPCSection() {
  const [activeCategory, setActiveCategory] = useState("gaming");
  const activeConfig = categories.find((c) => c.id === activeCategory)!;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-accent/20 rounded-full blur-3xl" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-2">
            🌟 PC Rakitan Siap Pakai
          </Badge>
          <h2 className="mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Mesin Bertenaga Siap Pakai
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Pilih kategori Anda dan jelajahi sistem yang dikonfigurasi oleh
            ahli. Setiap unit dirakit, diuji, dan dioptimalkan untuk performa
            terbaik.
          </p>
        </div>

        {/* Category Tabs with Toggle Animation */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-accent text-accent-foreground shadow-lg scale-105"
                  : "bg-card text-muted-foreground hover:bg-secondary border border-border"
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Active Category Display with Animated Transition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Specs & Features */}
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <p className="text-sm font-semibold text-primary mb-2">
                {activeConfig.tagline}
              </p>
              <h3 className="text-3xl font-bold mb-4">{activeConfig.name}</h3>
              <p className="text-muted-foreground text-lg">
                {activeConfig.description}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {activeConfig.specs.map((spec, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-lg font-semibold mt-1 text-primary">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Fitur Utama
              </p>
              <ul className="space-y-2">
                {activeConfig.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(activeConfig.price)}
              </p>
            </div>
          </div>

          {/* Right Side - Visual Showcase */}
          <div className="relative">
            <div className="relative h-96 rounded-xl border-2 border-border bg-card/50 p-8 flex items-center justify-center overflow-hidden group hover:border-accent/50 transition-colors">
              <div className="relative z-10 text-center space-y-4">
                <div className="h-40 w-40 mx-auto rounded-lg bg-accent flex items-center justify-center text-accent-foreground animate-bounce">
                  {activeConfig.icon}
                </div>
                <p className="text-sm font-semibold">{activeConfig.name}</p>
                <p className="text-xs text-muted-foreground">
                  Klik untuk melihat di toko
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Tambahkan ke Keranjang <ShoppingCart />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { useState } from 'react';
import {
  ArrowRight,
  HardDrive,
  PcCase,
  MoreHorizontal,
  Gpu,
  Cpu,
  BadgeInfo,
  Brain,
  MemoryStick,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/server/trpc/client';
import { categoryProductENUM, CategoryProductType } from '@/server/db/schema';
import { useQuery } from '@tanstack/react-query';

export function CustomBuildSection() {
  const [selectedComponent, setSelectedComponent] = useState<CategoryProductType>('cpu');
  const trpc = useTRPC();

  const handleComponentClick = (value: CategoryProductType) => {
    setSelectedComponent(value);
  };

  const { data, isLoading, error } = useQuery(
    trpc.product.getByCategory.queryOptions({
      category: selectedComponent,
      limit: 2,
    })
  );

  const restrictCategory = Object.values(categoryProductENUM.enumValues).filter(
    (cat) =>
      cat === 'cpu' ||
      cat === 'gpu' ||
      cat === 'motherboard' ||
      cat === 'ram' ||
      cat === 'storage' ||
      cat === 'casing'
  );
  const categories = restrictCategory.map((cat) => {
    let icon;
    let name;
    switch (cat) {
      case 'cpu':
        icon = <Cpu />;
        name = 'CPU';
        break;
      case 'gpu':
        icon = <Gpu />;
        name = 'GPU';
        break;
      case 'motherboard':
        icon = <Brain />;
        name = 'Motherboard';
        break;
      case 'ram':
        icon = <MemoryStick />;
        name = 'RAM';
        break;
      case 'storage':
        icon = <HardDrive />;
        name = 'Storage';
        break;
      case 'casing':
        icon = <PcCase />;
        name = 'Casing';
        break;
      default:
        icon = <PcCase />;
        name = cat;
    }
    return { category: cat, icon, name };
  });

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="bg-primary absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full mix-blend-multiply blur-3xl filter"></div>
        <div className="bg-secondary absolute right-10 bottom-20 h-72 w-72 animate-pulse rounded-full mix-blend-multiply blur-3xl filter delay-2000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge className="mb-2 scale-125">🎯 Bangun PC Impian Anda</Badge>
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
            Rakit PC Kustom
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Klik komponen di bawah untuk menjelajahi opsi dan mulai membangun PC sempurna Anda hari
            ini!
          </p>
        </div>

        {/* Interactive Build Configurator */}
        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Visual Configurator */}
          <div className="space-y-8">
            {/* Component Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleComponentClick(cat.category)}
                  className={`group relative transform rounded-lg border-2 p-6 transition-all duration-300 hover:scale-105 ${
                    selectedComponent === cat.category
                      ? 'border-primary bg-primary/10'
                      : 'border-muted-foreground/20 hover:border-primary'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="text-primary text-2xl">{cat.icon}</div>
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <p className="text-muted-foreground text-xs">Klik untuk melihat opsi</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Build Details */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 text-2xl font-bold">Sesuaikan Setiap Detail</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {/* {buildComponents[selectedComponent].items
                    ? `Opsi untuk ${buildComponents[selectedComponent].name}`
                    : null} */}
                  Opsi untuk {categories.find((cat) => cat.category === selectedComponent)?.name}
                </p>
                {isLoading || error ? (
                  <div>Loading...</div>
                ) : data ? (
                  <ItemGroup className="grid grid-cols-3 gap-4">
                    {data.map((component) => (
                      <Item key={component.name} variant="muted">
                        <ItemHeader>
                          <Image
                            src={component.imageUrl ?? ''}
                            alt={component.name}
                            width={128}
                            height={128}
                            className="aspect-square w-full rounded-sm object-cover"
                          />
                        </ItemHeader>
                        <ItemContent>
                          <ItemTitle>{component.name}</ItemTitle>
                        </ItemContent>
                      </Item>
                    ))}
                    <Item key="Many" variant="muted">
                      <ItemHeader className="flex items-center justify-center">
                        <MoreHorizontal className="text-muted-foreground h-16 w-16 animate-pulse" />
                      </ItemHeader>
                      <ItemContent className="mt-auto">
                        <ItemTitle>Banyak Lagi Opsi Tersedia!</ItemTitle>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                ) : (
                  <Item variant="muted" className="w-full">
                    <ItemMedia variant="icon">
                      <BadgeInfo />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Kunjungi Halaman Rakit Kustom untuk Lebih Banyak Opsi</ItemTitle>
                      <ItemDescription>
                        Jelajahi berbagai macam komponen PC untuk membangun setup impian Anda.
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/rakit-komputer-custom">Build Now</Link>
                      </Button>
                    </ItemActions>
                  </Item>
                )}
                <div className="space-y-3">
                  <p className="text-muted-foreground text-sm">Fitur Rakit:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-sm">
                      <span className="bg-primary h-2 w-2 rounded-full"></span>
                      Pencocokan komponen ahli & kompatibilitas
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="bg-secondary-foreground h-2 w-2 rounded-full"></span>
                      Perakitan & pengujian profesional
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="bg-accent-foreground h-2 w-2 rounded-full"></span>
                      Dukungan teknis seumur hidup
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <span className="bg-muted-foreground h-2 w-2 rounded-full"></span>
                      Estetika kustom & manajemen kabel
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 w-full gap-2 bg-linear-to-r text-white transition hover:scale-105 hover:transform"
              asChild
            >
              <Link href="/rakit-komputer-custom">
                Mulai Rakit Komputer Kustom <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

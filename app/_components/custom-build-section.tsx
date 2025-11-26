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
  Zap,
  HardDrive,
  PcCase,
  MoreHorizontal,
  Gpu,
  Cpu,
  BadgeInfo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface BuildComponent {
  name: string;
  icon: React.ReactNode;
  items?: {
    name: string;
    image: string;
  }[];
}

const buildComponents: BuildComponent[] = [
  {
    name: 'CPU',
    icon: <Cpu className="h-5 w-5" />,
    items: [
      {
        name: 'AMD Ryzen 9 7950X',
        image: 'https://m.media-amazon.com/images/I/5116zdA9uyL._AC_UF894,1000_QL80_.jpg',
      },
      {
        name: 'Intel Core i7-13700K',
        image:
          'https://kkomputer.com/7077-large_default/intel-core-i7-13700k-54-ghz-16c24t-lga-1700-rl.jpg',
      },
    ],
  },
  {
    name: 'GPU',
    icon: <Gpu className="h-5 w-5" />,
    items: [
      {
        name: 'NVIDIA GeForce RTX 4090',
        image:
          'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//101/MTA-91915292/asus_asus_tuf_gaming_geforce_rtx_4090_oc_edition_24gb_gddr6x_full01_jvqire6p.jpg',
      },
      {
        name: 'NVIDIA GeForce RTX 4080',
        image:
          'https://asset.msi.com/resize/image/global/product/product_17047017992412b3cf6a0f603661cbab5fb5a7f44a.png62405b38c58fe0f07fcef2367d8a9ba1/600.png',
      },
    ],
  },
  {
    name: 'Memory',
    icon: <Zap className="h-5 w-5" />,
    items: [
      {
        name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200',
        image:
          'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//82/MTA-44200313/corsair_corsair_lpx_32gb_-2x16gb-_3200mhz_c16_ddr4_dram_-cmk32gx4m2b3200c16-_full01_kccylh25.jpg',
      },
      {
        name: 'G.Skill Trident Z RGB 32GB (2x16GB) DDR4-3600',
        image:
          'https://static.jakmall.id/2021/09/images/products/18c572/detail/gskill-trident-z-rgb-32gb-2x16gb-ddr4-pc28800-f4-3600c18d-32gtzr.jpg',
      },
    ],
  },
  {
    name: 'Storage',
    icon: <HardDrive className="h-5 w-5" />,
    items: [
      {
        name: 'Samsung 970 EVO Plus 1TB NVMe SSD',
        image:
          'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//106/MTA-7665847/samsung_samsung_1tb_970_evo_plus_nvme_m2_ssd_full03_jyy86igo.jpg',
      },
      {
        name: 'Seagate Barracuda 2TB HDD',
        image: 'https://els.id/wp-content/uploads/2023/09/57a897cc-8a0f-44e2-bedc-9d4e27ec7e1c.jpg',
      },
    ],
  },
  {
    name: 'Case',
    icon: <PcCase className="h-5 w-5" />,
    items: [
      {
        name: 'NZXT H510 Mid Tower Case',
        image: 'https://www.jagatreview.com/wp-content/uploads/2019/05/NZXT-H510-Elite.jpg',
      },
      {
        name: 'Corsair 4000D Airflow Mid Tower Case',
        image:
          'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//105/MTA-22608698/corsair_4000d_airflow_tempered_glass_mid-tower_atx_case_full02_g1s92vf.jpg',
      },
    ],
  },
  {
    name: 'More Components',
    icon: <MoreHorizontal className="h-5 w-5" />,
  },
];

export function CustomBuildSection() {
  const [selectedComponent, setSelectedComponent] = useState(0);

  const handleComponentClick = (index: number) => {
    setSelectedComponent(index);
  };

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
              {buildComponents.map((comp, index) => (
                <button
                  key={index}
                  onClick={() => handleComponentClick(index)}
                  className={`group relative transform rounded-lg border-2 p-6 transition-all duration-300 hover:scale-105 ${
                    selectedComponent === index
                      ? 'border-primary bg-primary/10'
                      : 'border-muted-foreground/20 hover:border-primary'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="text-primary text-2xl">{comp.icon}</div>
                    <p className="text-sm font-semibold">{comp.name}</p>
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
                  {buildComponents[selectedComponent].items
                    ? `Opsi untuk ${buildComponents[selectedComponent].name}`
                    : null}
                </p>
                {buildComponents[selectedComponent].items ? (
                  <ItemGroup className="grid grid-cols-3 gap-4">
                    {buildComponents[selectedComponent].items.map((component) => (
                      <Item key={component.name} variant="muted">
                        <ItemHeader>
                          <Image
                            src={component.image}
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

'use client';

import { Facebook } from '@/components/svgs/facebook';
import { Instagram } from '@/components/svgs/instagram';
import { LinkedIn } from '@/components/svgs/linked-in';
import { XformerlyTwitter } from '@/components/svgs/x-twitter';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-muted border-t">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Sections */}
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
                <span className="text-sm font-bold">RP</span>
              </div>
              <span className="text-lg font-bold">Rakitin PC</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Solusi terbaik untuk semua kebutuhan komputermu dengan harga bersaing dan dukungan
              pelanggan terbaik.
            </p>
          </div>

          {/* Produk */}
          <div>
            <h4 className="mb-4 font-semibold">Produk</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pc-custom" className="hover:text-primary transition">
                  PC Custom
                </Link>
              </li>
              <li>
                <Link href="/products?type=prebuilt" className="hover:text-primary transition">
                  PC Siap Pakai
                </Link>
              </li>
              <li>
                <Link href="/products?type=component" className="hover:text-primary transition">
                  Komponen
                </Link>
              </li>
              <li>
                <Link href="/products?type=accessory" className="hover:text-primary transition">
                  Aksesoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="mb-4 font-semibold">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Karir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="mb-4 font-semibold">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" /> +62 812 3456 7890
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" /> info@rakitinpc.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-1" /> Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-muted border-t py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2025 Rakitin PC. Semua hak dilindungi.
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <XformerlyTwitter />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <LinkedIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-muted text-muted-foreground flex flex-col gap-4 border-t pt-8 text-xs sm:flex-row">
          <Link href="#" className="hover:text-primary">
            Kebijakan Privasi
          </Link>
          <Link href="#" className="hover:text-primary">
            Syarat & Ketentuan
          </Link>
          <Link href="#" className="hover:text-primary">
            Kebijakan Pengembalian
          </Link>
        </div>
      </div>
    </footer>
  );
}

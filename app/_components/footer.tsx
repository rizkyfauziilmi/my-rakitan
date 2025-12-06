'use client';

import { Facebook } from '@/components/svgs/facebook';
import { Instagram } from '@/components/svgs/instagram';
import { LinkedIn } from '@/components/svgs/linked-in';
import { XformerlyTwitter } from '@/components/svgs/x-twitter';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary/10 text-foreground border-muted-foreground border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="mb-12 grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="from-primary to-secondary flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                <span className="text-sm font-bold">RP</span>
              </div>
              <span className="text-lg font-bold">Rakitin PC</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Solusi terbaik untuk semua kebutuhan komputermu dengan harga bersaing dan layanan
              pelanggan terbaik.
            </p>
          </div>

          {/* Links */}
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
                  PC Rakitan Siap Pakai
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

          {/* Company */}
          <div>
            <h4 className="mb-4 font-semibold">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>info@rakitinpc.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-1 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-muted-foreground border-t py-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              © 2025 Rakitin PC. Semua hak dilindungi.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-4 md:mt-0">
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
        <div className="text-muted-foreground border-muted-foreground flex flex-col gap-4 border-t pt-8 text-xs sm:flex-row">
          <a href="#" className="hover:text-primary transition">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:text-primary transition">
            Syarat & Ketentuan
          </a>
          <a href="#" className="hover:text-primary transition">
            Kebijakan Pengembalian
          </a>
        </div>
      </div>
    </footer>
  );
}

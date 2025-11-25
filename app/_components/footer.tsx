"use client";

import { Facebook } from "@/components/svgs/facebook";
import { Instagram } from "@/components/svgs/instagram";
import { LinkedIn } from "@/components/svgs/linked-in";
import { XformerlyTwitter } from "@/components/svgs/x-twitter";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary/10 text-foreground border-t border-muted-foreground">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer */}
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="font-bold text-sm">RP</span>
                            </div>
                            <span className="text-lg font-bold">
                                Rakitin PC
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Solusi terbaik untuk semua kebutuhan komputermu
                            dengan harga bersaing dan layanan pelanggan terbaik.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Produk</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    PC Custom
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    PC Rakitan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Komponen
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Aksesoris
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Perusahaan</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Karir
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-primary transition"
                                >
                                    Kontak
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Kontak</h4>
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
                                <MapPin
                                    size={16}
                                    className="text-primary shrink-0 mt-1"
                                />
                                <span>Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-muted-foreground py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* Copyright */}
                        <p className="text-sm text-muted-foreground">
                            © 2025 Rakitin PC. Semua hak dilindungi.
                        </p>

                        {/* Social */}
                        <div className="flex items-center gap-4 mt-6 md:mt-0">
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition"
                            >
                                <Facebook />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition"
                            >
                                <Instagram />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition"
                            >
                                <XformerlyTwitter />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition"
                            >
                                <LinkedIn />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground border-t border-muted-foreground pt-8">
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

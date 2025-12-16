'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqData = [
  {
    question: 'Apa itu MyRakitan.id?',
    answer:
      'MyRakitan.id adalah platform yang menyediakan layanan rakit PC custom, PC siap pakai, serta berbagai komponen dan aksesoris komputer berkualitas.',
  },
  {
    question: 'Apakah saya bisa merakit PC sesuai kebutuhan saya?',
    answer:
      'Tentu bisa. Kamu dapat menggunakan fitur Rakit PC Custom untuk memilih komponen sesuai kebutuhan gaming, desain grafis, maupun profesional.',
  },
  {
    question: 'Apakah PC sudah dirakit sebelum dikirim?',
    answer:
      'Ya. Semua PC dirakit oleh teknisi berpengalaman dan melalui proses quality control sebelum pengiriman.',
  },
  {
    question: 'Apakah ada garansi untuk produk?',
    answer:
      'Setiap produk memiliki garansi resmi dari distributor atau pabrikan sesuai ketentuan masing-masing.',
  },
  {
    question: 'Bagaimana cara menghubungi MyRakitan.id?',
    answer:
      'Kamu bisa menghubungi kami melalui halaman Kontak, email, atau sosial media resmi MyRakitan.id.',
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState('');

  const filteredFaq = faqData.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          FAQ <span className="text-primary">MyRakitan.id</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Punya pertanyaan? Cari jawaban cepat seputar layanan dan produk kami di sini.
        </p>
      </section>

      <div className="mx-auto mb-12 max-w-xl">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-visible:ring-primary rounded-2xl border pl-12 transition focus-visible:ring-2 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <section className="mx-auto max-w-3xl">
        {filteredFaq.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaq.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl border px-4"
              >
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center">Pertanyaan tidak ditemukan.</p>
        )}
      </section>
    </main>
  );
}

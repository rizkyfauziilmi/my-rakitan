import { Facebook } from '@/components/svgs/facebook';
import { Instagram } from '@/components/svgs/instagram';
import { XformerlyTwitter } from '@/components/svgs/x-twitter';
import { YouTube } from '@/components/svgs/youtube';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function KontakPage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-16 text-center">
        <h1 className="text-primary mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Contact <span className="text-white">Us</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Punya pertanyaan, butuh bantuan, atau ingin konsultasi rakit PC? Tim{' '}
          <span className="text-primary font-semibold">MyRakitan.id</span> siap membantu kamu.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="bg-background flex flex-col items-center rounded-2xl border p-10 text-center shadow-sm">
          <h2 className="text-primary mb-8 text-3xl font-bold">Informasi Kontak</h2>
          <div className="w-full max-w-md space-y-6">
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-sm">Telepon</p>
                <p className="text-base font-medium">0812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-base font-medium">myrakitanid@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-muted-foreground text-sm">Lokasi</p>
                <p className="text-base font-medium">Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
              Ikuti Kami
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Instagram className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <YouTube className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <XformerlyTwitter className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-background flex flex-col items-center justify-center rounded-2xl border p-10 text-center shadow-sm">
          <h2 className="text-primary mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Konsultasi Gratis
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Hubungi kami melalui WhatsApp, email, atau sosial media untuk mendapatkan rekomendasi
            rakitan PC terbaik sesuai kebutuhan kamu.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="rounded-2xl px-8 py-6 text-base sm:text-lg">
              Hubungi via WhatsApp
            </Button>
            <Button variant="outline" className="rounded-2xl px-8 py-6 text-base sm:text-lg">
              Kirim Email
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

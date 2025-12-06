import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-100px)] items-center justify-center">
      <div className="flex flex-1 flex-col items-start gap-4 text-left">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
          Bangun PC Impianmu bersama{' '}
          <span className="text-primary font-extrabold">MyRakitan.id</span>
        </h1>
        <p className="text-xl">
          Temukan solusi terbaik untuk semua kebutuhan komputermu dengan{' '}
          <span className="text-primary font-extrabold">harga bersaing</span> dan{' '}
          <span className="text-primary font-extrabold">layanan pelanggan terbaik</span>. Mulai
          rakit sekarang dan wujudkan{' '}
          <span className="text-primary font-extrabold">performa maksimal!</span>
        </p>
        <div>
          <Button asChild>
            <Link href="rakit-komputer-custom">Rakit Komputer Sekarang</Link>
          </Button>
          <Button variant="outline" className="ml-4" asChild>
            <Link href="/products">Lihat Produk Lainnya</Link>
          </Button>
        </div>
      </div>
      <Image
        src="/hero-image.png"
        alt="Hero Image"
        className="flex-1 object-contain"
        width={500}
        height={500}
      />
    </section>
  );
}

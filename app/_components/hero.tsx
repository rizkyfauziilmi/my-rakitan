import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-100px)] flex-col-reverse md:flex-row md:items-center md:justify-center">
      <div className="flex flex-1 flex-col items-start gap-4 text-left">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Bangun PC Impianmu bersama{' '}
          <span className="text-primary font-extrabold">MyRakitan.id</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl">
          Temukan solusi terbaik untuk semua kebutuhan komputermu dengan{' '}
          <span className="text-primary font-extrabold">harga bersaing</span> dan{' '}
          <span className="text-primary font-extrabold">layanan pelanggan terbaik</span>. Mulai
          rakit sekarang dan wujudkan{' '}
          <span className="text-primary font-extrabold">performa maksimal!</span>
        </p>
        <div className="flex w-full flex-col items-center gap-2 md:flex-row">
          <Button asChild className="w-full md:w-fit">
            <Link href="/pc-custom">Rakit Komputer Sekarang</Link>
          </Button>
          <Button variant="outline" asChild className="w-full md:w-fit">
            <Link href="/products">Lihat Produk Lainnya</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center lg:justify-end">
        <Image
          src="/hero-image.png"
          alt="Hero Image"
          className="w-full max-w-xs object-contain sm:max-w-sm md:max-w-md lg:max-w-lg"
          width={500}
          height={500}
        />
      </div>
    </section>
  );
}

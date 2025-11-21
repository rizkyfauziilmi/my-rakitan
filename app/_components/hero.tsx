import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-100px)] flex items-center justify-center p-8">
      <div className="flex flex-col items-start flex-1 text-left gap-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
          Bangun PC Impianmu bersama{" "}
          <span className="text-primary font-extrabold">MyRakitan.id</span>
        </h1>
        <p className="text-xl">
          Temukan solusi terbaik untuk semua kebutuhan komputermu dengan{" "}
          <span className="text-primary font-extrabold">harga bersaing</span>{" "}
          dan{" "}
          <span className="text-primary font-extrabold">
            layanan pelanggan terbaik
          </span>
          . Mulai rakit sekarang dan wujudkan{" "}
          <span className="text-primary font-extrabold">
            performa maksimal!
          </span>
        </p>
        <div>
          <Button asChild>
            <Link href="rakit-komputer-custom">Rakit Komputer Sekarang</Link>
          </Button>
          <Button variant="outline" className="ml-4" asChild>
            <Link href="komponen">Lihat Komponen</Link>
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

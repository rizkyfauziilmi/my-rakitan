import Image from 'next/image';

export default function AboutUs() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-20 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Tentang <span className="text-primary">MyRakitan.id</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <span className="text-primary font-semibold">MyRakitan.id</span> adalah platform
            terpercaya untuk membantu kamu membangun PC impian sesuai kebutuhan, mulai dari PC
            Gaming, PC Kantor, Produktivitas untuk Vlog, hingga Profesional Konten Kreator.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/hero-image.png"
            alt="Tentang MyRakitan"
            width={500}
            height={500}
            className="w-full max-w-md object-contain"
          />
        </div>
      </section>

      <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="bg-background rounded-2xl border p-8 shadow-sm">
          <h2 className="text-primary mb-4 text-2xl font-semibold">Visi Kami</h2>
          <p className="text-muted-foreground leading-relaxed">
            Menjadi platform rakit PC nomor satu di Indonesia yang menghadirkan solusi teknologi
            terbaik dengan harga kompetitif dan layanan profesional.
          </p>
        </div>

        <div className="bg-background rounded-2xl border p-8 shadow-sm">
          <h2 className="text-primary mb-4 text-2xl font-semibold">Misi Kami</h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-2">
            <li>Menyediakan komponen PC berkualitas dan original</li>
            <li>Membantu pengguna memilih rakitan sesuai kebutuhan</li>
            <li>Memberikan pengalaman belanja yang aman dan nyaman</li>
            <li>Menghadirkan layanan pelanggan yang responsif</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
          Kenapa Memilih <span className="text-primary">MyRakitan.id?</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Harga Kompetitif',
              desc: 'Kami menawarkan harga terbaik dan transparan untuk setiap komponen.',
            },
            {
              title: 'Komponen Original',
              desc: 'Semua produk dijamin original dan bergaransi resmi.',
            },
            {
              title: 'Custom Sesuai Kebutuhan',
              desc: 'Rakit PC sesuai kebutuhan gaming, kerja, atau profesional.',
            },
            {
              title: 'Support Profesional',
              desc: 'Tim kami siap membantu sebelum dan sesudah pembelian.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-background hover:border-primary rounded-2xl border p-6 text-center transition hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

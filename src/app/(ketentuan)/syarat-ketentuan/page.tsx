import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// Fungsi untuk mengambil pengaturan website dari database
export async function getSettingWeb() {
  const data = await prisma.websiteConfig.findFirst();
  return data;
}

// Generate metadata untuk SEO
export async function generateMetadata(): Promise<Metadata> {
  const data = await getSettingWeb();

  return {
    title: `Top Up Game Murah dan Terpercaya - ${data?.judul_web}`,
    description: `Website resmi untuk top up game online dengan harga terjangkau dan proses cepat. ${data?.deskripsi_web}`,
    icons: {
      icon: data?.logo_header as string,
    },
    creator: "Wafiuddin Wafiq",
    keywords: ["top up game", "beli diamond murah", "voucher game", "top up online"],
    twitter: {
      card: "summary_large_image",
      creator: "@wafiuddin",
      description: `Website resmi untuk top up game online dengan harga terjangkau dan proses cepat. ${data?.deskripsi_web}`,
      images: data?.og_image as string,
    },
    openGraph: {
      title: `Top Up Game Murah dan Terpercaya - ${data?.judul_web}`,
      description: `Website resmi untuk top up game online dengan harga terjangkau dan proses cepat. ${data?.deskripsi_web}`,
      url: `${process.env.NEXTAUTH_URL}`,
      images: [
        {
          url: data?.og_image as string,
          width: 1200,
          height: 630,
          alt: "Top Up Game Online",
        },
      ],
      siteName: data?.judul_web || "Top Up Game Website",
      type: "website",
    },
  };
}

// Halaman utama
export default async function Page() {
  const data = await getSettingWeb();

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-150px)] justify-center items-center ">
      {/* Header */}
      <header className=" text-white py-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Top Up Game Online</h1>
          <p className="mt-2 text-lg">Murah, Cepat, dan Terpercaya</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto my-8 px-4">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tentang Layanan Kami</h2>
          <p className="mb-4">
            Selamat datang di {data?.judul_web}, platform top up game online terbaik untuk semua kebutuhan gaming Anda. Kami menyediakan berbagai layanan top up untuk game populer seperti Mobile Legends, Free Fire, PUBG, dan banyak lagi.
          </p>
          <p className="mb-4">
            Dengan proses yang cepat dan harga yang kompetitif, kami memastikan Anda mendapatkan pengalaman bermain game yang lebih baik tanpa harus khawatir tentang pembelian item atau diamond.
          </p>
        </section>

        {/* Fitur Utama */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Fitur Unggulan</h2>
          <ul className="list-disc pl-6">
            <li>Proses top up instan.</li>
            <li>Harga termurah di pasaran.</li>
            <li>Support 24/7 untuk bantuan pelanggan.</li>
            <li>Beragam metode pembayaran.</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      
    </div>
  );
}
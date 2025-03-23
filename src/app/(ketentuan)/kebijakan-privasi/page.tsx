import { Metadata } from "next";
import { getSettingWeb } from "../syarat-ketentuan/page";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSettingWeb();
  
  return {
    title: `Kebijakan Privasi - ${data?.judul_web}`,
    description: `Kebijakan Privasi Vazzuniverse. Informasi tentang bagaimana kami mengumpulkan dan melindungi data anda. ${data?.deskripsi_web}`,
    icons: {
      icon: data?.logo_header as string,
    },
    creator: "Wafiuddin Wafiq",
    keywords: ["kebijakan privasi", "privacy policy", "vazzuniverse", "top up game"],
    twitter: {
      card: "summary_large_image",
      creator: "@wafiuddin",
      description: `Kebijakan Privasi Vazzuniverse. Informasi tentang bagaimana kami mengumpulkan dan melindungi data anda. ${data?.deskripsi_web}`,
      images: data?.og_image as string,
    },
    openGraph: {
      title: `Kebijakan Privasi - ${data?.judul_web}`,
      description: `Kebijakan Privasi Vazzuniverse. Informasi tentang bagaimana kami mengumpulkan dan melindungi data anda. ${data?.deskripsi_web}`,
      url: `${process.env.NEXTAUTH_URL}/kebijakan-privasi`,
      images: [
        {
          url: data?.og_image as string,
          width: 1200,
          height: 630,
          alt: "Kebijakan Privasi Vazzuniverse",
        },
      ],
      siteName: data?.judul_web || "Vazzuniverse",
      type: "website",
    },
  };
}

export default async function Page() {
  const data = await getSettingWeb();
  
  return (
    <main className="min-h-screen ">
      {/* Header */}
      <section className="relative w-full py-16 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Informasi tentang bagaimana Vazzuniverse mengumpulkan, menggunakan, dan melindungi data Anda.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto  p-8 rounded-lg shadow-lg">
          <div className="prose prose-lg prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">Kebijakan Privasi untuk Vazzuniverse</h2>
            
            <p className="text-gray-300 mb-6">
              Di Vazzuniverse, yang dapat diakses dari https://www.vazzuniverse.id, salah satu prioritas utama kami adalah privasi pengunjung kami. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh Vazzuniverse dan bagaimana kami menggunakannya.
            </p>
            
            <p className="text-gray-300 mb-6">
              Jika Anda memiliki pertanyaan tambahan atau memerlukan informasi lebih lanjut tentang Kebijakan Privasi kami, jangan ragu untuk menghubungi kami.
              Kebijakan Privasi ini hanya berlaku untuk aktivitas online kami dan berlaku untuk pengunjung situs web kami sehubungan dengan informasi yang mereka bagikan dan/atau kumpulkan di Vazzuniverse. Kebijakan ini tidak berlaku untuk informasi apa pun yang dikumpulkan secara offline atau melalui saluran selain situs web ini. Kebijakan Privasi kami dibuat dengan bantuan Generator Online Kebijakan Privasi.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Persetujuan</h3>
            
            <p className="text-gray-300 mb-6">
              Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui ketentuannya.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Informasi yang kami kumpulkan</h3>
            
            <p className="text-gray-300 mb-6">
              Informasi pribadi yang diminta untuk Anda berikan, dan alasan mengapa Anda diminta untuk memberikannya, akan dijelaskan kepada Anda pada saat kami meminta Anda untuk memberikan informasi pribadi Anda.
            </p>
            
            <p className="text-gray-300 mb-6">
              Jika Anda menghubungi kami secara langsung, kami mungkin menerima informasi tambahan tentang Anda seperti nama, alamat email, nomor telepon, isi pesan dan/atau lampiran yang mungkin Anda kirimkan kepada kami, dan informasi lain apa pun yang mungkin Anda pilih untuk diberikan.
            </p>
            
            <p className="text-gray-300 mb-6">
              Saat Anda mendaftar untuk Akun, kami mungkin meminta informasi kontak Anda, termasuk item seperti nama, nama perusahaan, alamat, alamat email, dan nomor telepon.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Bagaimana kami menggunakan informasi Anda</h3>
            
            <p className="text-gray-300 mb-4">
              Kami menggunakan informasi yang kami kumpulkan dengan berbagai cara, termasuk untuk:
            </p>
            
            <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
              <li>Menyediakan, mengoperasikan, dan memelihara situs web kami</li>
              <li>Meningkatkan, mempersonalisasi, dan memperluas situs web kami</li>
              <li>Memahami dan menganalisis bagaimana Anda menggunakan situs web kami</li>
              <li>Mengembangkan produk, layanan, fitur, dan fungsionalitas baru</li>
              <li>Berkomunikasi dengan Anda, baik secara langsung atau melalui salah satu mitra kami, termasuk untuk layanan pelanggan, untuk memberi Anda pembaruan dan informasi lain yang berkaitan dengan situs web, dan untuk tujuan pemasaran dan promosi</li>
              <li>Mengirim email kepada Anda</li>
              <li>Menemukan dan mencegah penipuan</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Log Files</h3>
            
            <p className="text-gray-300 mb-6">
              Vazzuniverse mengikuti prosedur standar penggunaan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Semua perusahaan hosting melakukan ini dan merupakan bagian dari analitik layanan hosting. Informasi yang dikumpulkan oleh file log termasuk alamat protokol internet (IP), jenis browser, Penyedia Layanan Internet (ISP), cap tanggal dan waktu, halaman rujukan/keluar, dan kemungkinan jumlah klik. Ini tidak terkait dengan informasi apa pun yang dapat diidentifikasi secara pribadi. Tujuan informasi tersebut adalah untuk menganalisis tren, mengelola situs, melacak pergerakan pengguna di situs web, dan mengumpulkan informasi demografis.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Cookies dan Web Beacons</h3>
            
            <p className="text-gray-300 mb-6">
              Seperti situs web lainnya, Vazzuniverse menggunakan 'cookies'. Cookie ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung, dan halaman di situs web yang diakses atau dikunjungi pengunjung. Informasi tersebut digunakan untuk mengoptimalkan pengalaman pengguna dengan menyesuaikan konten halaman web kami berdasarkan jenis browser pengunjung dan/atau informasi lainnya.
            </p>
            
            <p className="text-gray-300 mb-6">
              Untuk informasi lebih umum tentang cookie, silakan baca 'Apa Itu Cookie' dari Cookie Consent.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Cookie Google DoubleClick DART</h3>
            
            <p className="text-gray-300 mb-6">
              Google adalah salah satu vendor pihak ketiga di situs kami. Ini juga menggunakan cookie, yang dikenal sebagai cookie DART, untuk menayangkan iklan kepada pengunjung situs kami berdasarkan kunjungan mereka ke www.website.com dan situs lain di internet. Namun, pengunjung dapat memilih untuk menolak penggunaan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut – <a href="https://policies.google.com/technologies/ads" className="text-blue-400 hover:text-blue-300">https://policies.google.com/technologies/ads</a>
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Mitra Periklanan Kami</h3>
            
            <p className="text-gray-300 mb-6">
              Beberapa pengiklan di situs kami mungkin menggunakan cookie dan web beacon. Mitra periklanan kami tercantum di bawah ini. Setiap mitra periklanan kami memiliki Kebijakan Privasi mereka sendiri untuk kebijakan mereka tentang data pengguna. Untuk akses yang lebih mudah, kami menautkan ke Kebijakan Privasi mereka di bawah ini.
            </p>
            
            <ul className="list-disc pl-6 text-gray-300 mb-6">
              <li>Google: <a href="https://policies.google.com/technologies/ads" className="text-blue-400 hover:text-blue-300">https://policies.google.com/technologies/ads</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Kebijakan Privasi Mitra Periklanan</h3>
            
            <p className="text-gray-300 mb-6">
              Anda dapat berkonsultasi dengan daftar ini untuk menemukan Kebijakan Privasi untuk masing-masing mitra periklanan Vazzuniverse.
            </p>
            
            <p className="text-gray-300 mb-6">
              Server iklan pihak ketiga atau jaringan iklan menggunakan teknologi seperti cookie, JavaScript, atau Web Beacon yang digunakan dalam iklan masing-masing dan tautan yang muncul di Vazzuniverse, yang dikirim langsung ke browser pengguna. Mereka secara otomatis menerima alamat IP Anda ketika ini terjadi. Teknologi ini digunakan untuk mengukur efektivitas kampanye iklan mereka dan/atau untuk mempersonalisasi konten iklan yang Anda lihat di situs web yang Anda kunjungi.
            </p>
            
            <p className="text-gray-300 mb-6">
              Perhatikan bahwa Vazzuniverse tidak memiliki akses atau kontrol atas cookie ini yang digunakan oleh pengiklan pihak ketiga.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Kebijakan Privasi Pihak Ketiga</h3>
            
            <p className="text-gray-300 mb-6">
              Kebijakan Privasi Vazzuniverse tidak berlaku untuk pengiklan atau situs web lain. Karenanya, kami menyarankan Anda untuk berkonsultasi dengan Kebijakan Privasi masing-masing dari server iklan pihak ketiga ini untuk informasi yang lebih terperinci. Ini mungkin mencakup praktik dan instruksi mereka tentang cara memilih keluar dari opsi tertentu.
            </p>
            
            <p className="text-gray-300 mb-6">
              Anda dapat memilih untuk menonaktifkan cookie melalui opsi browser individual Anda. Untuk mengetahui informasi lebih rinci tentang manajemen cookie dengan browser web tertentu, dapat ditemukan di situs web masing-masing browser.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Hak Privasi CCPA (Jangan Jual Informasi Pribadi Saya)</h3>
            
            <p className="text-gray-300 mb-6">
              Di bawah CCPA, antara hak lainnya, konsumen California memiliki hak untuk:
            </p>
            
            <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
              <li>Meminta agar bisnis yang mengumpulkan data pribadi konsumen mengungkapkan kategori dan bagian spesifik dari data pribadi yang telah dikumpulkan bisnis tentang konsumen.</li>
              <li>Meminta agar bisnis menghapus data pribadi apa pun tentang konsumen yang telah dikumpulkan bisnis.</li>
              <li>Meminta agar bisnis yang menjual data pribadi konsumen, tidak menjual data pribadi konsumen.</li>
            </ul>
            
            <p className="text-gray-300 mb-6">
              Jika Anda membuat permintaan, kami memiliki waktu satu bulan untuk merespons Anda. Jika Anda ingin menggunakan salah satu dari hak ini, silakan hubungi kami.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Hak Perlindungan Data GDPR</h3>
            
            <p className="text-gray-300 mb-6">
              Kami ingin memastikan Anda sepenuhnya menyadari semua hak perlindungan data Anda. Setiap pengguna berhak atas hal berikut:
            </p>
            
            <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2">
              <li>Hak akses – Anda memiliki hak untuk meminta salinan data pribadi Anda. Kami mungkin mengenakan biaya kecil untuk layanan ini.</li>
              <li>Hak rektifikasi – Anda memiliki hak untuk meminta kami memperbaiki informasi apa pun yang Anda yakini tidak akurat. Anda juga memiliki hak untuk meminta kami melengkapi informasi yang Anda yakini tidak lengkap.</li>
              <li>Hak penghapusan – Anda memiliki hak untuk meminta kami menghapus data pribadi Anda, dalam kondisi tertentu.</li>
              <li>Hak membatasi pemrosesan – Anda memiliki hak untuk meminta kami membatasi pemrosesan data pribadi Anda, dalam kondisi tertentu.</li>
              <li>Hak untuk menolak pemrosesan – Anda memiliki hak untuk menolak pemrosesan data pribadi Anda oleh kami, dalam kondisi tertentu.</li>
              <li>Hak portabilitas data – Anda memiliki hak untuk meminta kami mentransfer data yang telah kami kumpulkan ke organisasi lain, atau langsung kepada Anda, dalam kondisi tertentu.</li>
            </ul>
            
            <p className="text-gray-300 mb-6">
              Jika Anda membuat permintaan, kami memiliki waktu satu bulan untuk merespons Anda. Jika Anda ingin menggunakan salah satu dari hak ini, silakan hubungi kami.
            </p>

            <h3 className="text-xl font-semibold text-white mt-8 mb-4">Informasi Anak</h3>
            
            <p className="text-gray-300 mb-6">
              Bagian lain dari prioritas kami adalah menambahkan perlindungan untuk anak-anak saat menggunakan internet. Kami mendorong orang tua dan wali untuk mengamati, berpartisipasi, dan/atau memantau dan membimbing aktivitas online mereka.
            </p>
            
            <p className="text-gray-300 mb-6">
              Vazzuniverse tidak dengan sengaja mengumpulkan Informasi Identifikasi Pribadi apa pun dari anak-anak di bawah usia 13 tahun. Jika Anda berpikir bahwa anak Anda memberikan jenis informasi ini di situs web kami, kami sangat mendorong Anda untuk segera menghubungi kami dan kami akan melakukan upaya terbaik kami untuk segera menghapus informasi tersebut dari catatan kami.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </main>
  );
}
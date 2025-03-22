import { WaMessage } from './wa-admin';

export const templatesWaCustMessage = ({ status }: WaMessage): string => {
  let message: string;

  if (status === 'PENDING') {
    message = `🕒 MENUNGGU PEMBAYARAN
        ──────────────────
        Produk: {{productName}}
        Jumlah: Rp{{amount}}
        ──────────────────
        Pembayaran Anda untuk {{productName}} saat ini sedang menunggu konfirmasi. Silakan selesaikan pembayaran Anda untuk melanjutkan pesanan.

        🔗 Selesaikan Pembayaran: {{link}}

        Jika Anda sudah melakukan pembayaran, harap tunggu sementara kami memverifikasi transaksi Anda. Proses ini mungkin memakan waktu hingga 15 menit.

        Butuh bantuan? Balas pesan ini untuk mendapatkan bantuan.`;
  } else if (status === 'PAID') {
    message = `💰 PEMBAYARAN DITERIMA
    ──────────────────
    Produk: {{productName}}
    Jumlah: Rp{{amount}}
    ──────────────────
    Kami telah menerima pembayaran Anda untuk {{productName}}. Pesanan Anda sekarang ada dalam sistem kami dan akan segera diproses.

    🔗 Lihat Pesanan: {{link}}

    Terima kasih atas pembelian Anda! Kami akan memberikan informasi tentang langkah selanjutnya segera.`;
  } else if (status === 'PROCESS') {
    message = `⏳ PEMBAYARAN SEDANG DIPROSES
    ──────────────────
    Produk: {{productName}}
    Jumlah: Rp{{amount}}
    ──────────────────
    Kami sedang memproses pembayaran Anda untuk {{productName}}. Proses ini biasanya memakan waktu 5-15 menit untuk diselesaikan.

    🔗 Periksa Status: {{link}}

    Kami akan mengirimkan pesan lain setelah pembayaran Anda dikonfirmasi. Mohon jangan melakukan pembayaran lain selama waktu ini.

    Butuh bantuan? Balas pesan ini untuk mendapatkan bantuan.`;
  } else if (status === 'SUCCESS') {
    message = `✅ PEMBAYARAN BERHASIL
    ──────────────────
    Produk: {{productName}}
    Jumlah: Rp{{amount}}
    ──────────────────
    Kabar baik! Pembayaran Anda untuk {{productName}} telah berhasil diterima. Pesanan Anda sekarang sedang diproses.

    Detail pesanan dan tanda terima tersedia di sini:
    🔗 Lihat Pesanan: {{link}}

    Terima kasih atas pembelian Anda! Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.`;
  } else if (status === 'FAILED') {
    message = `❌ PEMBAYARAN GAGAL
    ──────────────────
    Produk: {{productName}}
    Jumlah: Rp{{amount}}
    ──────────────────
    Sayangnya, pembayaran Anda untuk {{productName}} tidak dapat diproses karena terjadi kesalahan.

    Kemungkinan penyebabnya:
    - Dana tidak mencukupi
    - Kartu ditolak
    - Masalah jaringan
    - Pembatasan bank

    🔗 Coba Lagi: {{link}}

    Butuh bantuan? Balas pesan ini untuk mendapatkan bantuan dan kami akan memandu Anda melalui pilihan pembayaran alternatif.`;
  } else {
    message = `📝 PEMBARUAN PESANAN
    ──────────────────
    Produk: {{productName}}
    Jumlah: Rp{{amount}}
    ──────────────────
    Ada pembaruan mengenai pesanan Anda untuk {{productName}}.

    🔗 Lihat Detail: {{link}}

    Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami.`;
  }

  return message;
};

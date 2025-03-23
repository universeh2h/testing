import { WaMessage } from './wa-admin';

export const templatesWaCustMessage = ({ 
  status, 
  productName, 
  amount, 
  link 
}: WaMessage): string => {
  // Define separator as a constant for consistency
  const separator = "──────────────────";
  
  // Format amount with thousands separator if provided
  const formattedAmount = amount ? new Intl.NumberFormat('id-ID').format(amount) : '{{amount}}';
  
  // Use actual values if available, otherwise use placeholder
  const productNameDisplay = productName || '{{productName}}';
  const linkDisplay = link || '{{link}}';
  
  let message: string;

  if (status === 'PENDING') {
    message = `🕒 *MENUNGGU PEMBAYARAN*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Pembayaran Anda untuk *${productNameDisplay}* saat ini sedang menunggu konfirmasi. Silakan selesaikan pembayaran Anda untuk melanjutkan pesanan.
    
🔗 *Selesaikan Pembayaran*: ${linkDisplay}
    
Jika Anda sudah melakukan pembayaran, harap tunggu sementara kami memverifikasi transaksi Anda. Proses ini mungkin memakan waktu hingga 15 menit.
    
💬 Butuh bantuan? Balas pesan ini untuk mendapatkan bantuan.`;
  } else if (status === 'PAID') {
    message = `💰 *PEMBAYARAN DITERIMA*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Kami telah menerima pembayaran Anda untuk *${productNameDisplay}*. Pesanan Anda sekarang ada dalam sistem kami dan akan segera diproses.
    
🔗 *Lihat Pesanan*: ${linkDisplay}
    
✨ Terima kasih atas pembelian Anda! Kami akan memberikan informasi tentang langkah selanjutnya segera.`;
  } else if (status === 'PROCESS') {
    message = `⏳ *PESANAN SEDANG DIPROSES*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Pembayaran Anda untuk *${productNameDisplay}* telah diterima dan pesanan Anda sedang diproses. Tim kami sedang mempersiapkan pesanan Anda.
    
🔗 *Periksa Status*: ${linkDisplay}
    
📝 Kami akan mengupdate Anda ketika pesanan Anda siap.
    
💬 Butuh bantuan? Balas pesan ini untuk mendapatkan bantuan.`;
  } else if (status === 'SUCCESS') {
    message = `✅ *PESANAN BERHASIL*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
🎉 Kabar baik! Pesanan Anda untuk *${productNameDisplay}* telah berhasil selesai diproses.
    
Detail pesanan dan tanda terima tersedia di sini:
🔗 *Lihat Pesanan*: ${linkDisplay}
    
🙏 Terima kasih atas kepercayaan Anda! Jika Anda memiliki pertanyaan atau membutuhkan bantuan lainnya, jangan ragu untuk menghubungi kami.`;
  } else if (status === 'FAILED') {
    message = `❌ *PEMBAYARAN GAGAL*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Sayangnya, pembayaran Anda untuk *${productNameDisplay}* tidak dapat diproses karena terjadi kesalahan.
    
*Kemungkinan penyebabnya*:
- Dana tidak mencukupi
- Kartu ditolak
- Masalah jaringan
- Pembatasan bank
    
🔄 *Coba Lagi*: ${linkDisplay}
    
💬 Butuh bantuan? Balas pesan ini dan kami akan membantu Anda menemukan solusi pembayaran alternatif.`;
  } else if (status === 'EXPIRED') {
    message = `⏱️ *PEMBAYARAN KEDALUWARSA*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Batas waktu pembayaran untuk pesanan *${productNameDisplay}* Anda telah berakhir.
    
🔄 *Pesan Ulang*: ${linkDisplay}
    
Jika Anda masih berminat dengan produk ini, silakan klik tautan di atas untuk melakukan pemesanan baru.
    
💬 Butuh bantuan? Kami siap membantu! Balas pesan ini untuk berkonsultasi dengan tim kami.`;
  } else {
    message = `📝 *PEMBARUAN PESANAN*
    
${separator}
    
📦 *Produk*: ${productNameDisplay}
💰 *Jumlah*: Rp${formattedAmount}
    
${separator}
    
Ada pembaruan mengenai pesanan Anda untuk *${productNameDisplay}*.
    
🔗 *Lihat Detail*: ${linkDisplay}
    
📞 Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami dengan membalas pesan ini.`;
  }

  return message;
};
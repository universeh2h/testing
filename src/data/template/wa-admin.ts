export type WaMessage = {
  amount: number;
  productName: string;
  link: string;
  status: string;
  customerName?: string;
  orderId?: string;
  whatsapp?: string;
  method?: string;
};

export const templatesWaMessageAdmin = ({
  amount,
  link,
  productName,
  status,
  method,
  whatsapp,
  customerName = 'Pelanggan',
  orderId = '-',
}: WaMessage): string => {
  // Format amount with thousands separator
  const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);
  const separator = "──────────────────";
  let message: string;

  if (status === 'PENDING') {
    message = `🕒 *PESANAN BARU - MENUNGGU PEMBAYARAN*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
📢 *Keterangan*: 
Pesanan baru telah dibuat dan menunggu pembayaran dari pelanggan.
    
🔗 *Detail Pesanan*: ${link}
    
🔔 *Catatan*: Sistem akan otomatis memperbarui status saat pembayaran diterima.`;
  } else if (status === 'PAID') {
    message = `💰 *PEMBAYARAN DITERIMA*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
✅ *Keterangan*: 
Pembayaran telah diterima untuk pesanan ini. Silakan proses pesanan segera.
    
🔗 *Detail Pesanan*: ${link}
    
📌 *Catatan*: Mohon segera persiapkan produk untuk pengiriman.`;
  } else if (status === 'PROCESS') {
    message = `⏳ *PESANAN DALAM PROSES*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
🔄 *Keterangan*: 
Pesanan sedang diproses. Pembayaran telah dikonfirmasi.
    
🔗 *Detail Pesanan*: ${link}
    
📋 *Catatan*: Harap perbarui status pesanan setelah pengiriman.`;
  } else if (status === 'SUCCESS') {
    message = `✅ *TRANSAKSI BERHASIL*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
🎉 *Keterangan*: 
Transaksi telah berhasil dikonfirmasi. Pesanan sudah selesai diproses.
    
🔗 *Detail Pesanan*: ${link}
    
📊 *Status*: Pesanan telah selesai.`;
  } else if (status === 'FAILED') {
    message = `❌ *PEMBAYARAN GAGAL*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
⚠️ *Keterangan*: 
Pembayaran untuk pesanan ini gagal diproses.
    
*Kemungkinan penyebab*: 
- Dana tidak mencukupi
- Kartu ditolak
- Masalah jaringan
- Pembatasan bank
    
🔗 *Detail Pesanan*: ${link}
    
🔄 *Tindakan*: Silakan hubungi pelanggan untuk penyelesaian pembayaran.`;
  } else if (status === 'EXPIRED') {
    message = `⏱️ *PESANAN KEDALUWARSA*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
⏰ *Keterangan*: 
Batas waktu pembayaran telah berakhir dan pesanan ini otomatis dibatalkan.
    
🔗 *Detail Pesanan*: ${link}
    
📝 *Catatan*: Pelanggan perlu membuat pesanan baru jika masih berminat.`;
  } else {
    message = `📝 *PEMBARUAN PESANAN*
    
${separator}
    
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${formattedAmount}
📊 *Status*: ${status}
📱 *WhatsApp*: ${whatsapp || '-'}
💳 *Metode Pembayaran*: ${method || '-'}
    
${separator}
    
📢 *Keterangan*: 
Ada pembaruan pada status pesanan ini.
    
🔗 *Detail Pesanan*: ${link}
    
📌 *Catatan*: Mohon periksa dashboard admin untuk informasi lebih lanjut.`;
  }

  return message;
};
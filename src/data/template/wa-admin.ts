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
  let message: string;

  if (status === 'PENDING') {
    message = `🕒 *PESANAN BARU - MENUNGGU PEMBAYARAN*
      ──────────────────
      🆔 *ID Pesanan*: ${orderId}
      👤 *Pelanggan*: ${customerName}
      📦 *Produk*: ${productName}
      💰 *Jumlah*: Rp${amount}
      📱 *Whatsapp*: ${whatsapp}
      💳 *Metode Pembayaran*: ${method}
      ──────────────────
      📢 *Keterangan*: 
      Pesanan baru telah dibuat dan menunggu pembayaran dari pelanggan.

      🔗 *Detail Pesanan*: ${link}

      🔔 *Catatan*: Sistem akan otomatis memperbarui status saat pembayaran diterima.`;
  } else if (status === 'PAID') {
    message = `💰 *PEMBAYARAN DITERIMA*
──────────────────
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${amount}
📱 *Whatsapp*: ${whatsapp}
💳 *Metode Pembayaran*: ${method}
──────────────────
✅ *Keterangan*: 
Pembayaran telah diterima untuk pesanan ini. Silakan proses pesanan segera.

🔗 *Detail Pesanan*: ${link}

📌 *Catatan*: Mohon segera persiapkan produk untuk pengiriman.`;
  } else if (status === 'PROCESS') {
    message = `✅ *PEMBAYARAN BERHASIL - SIAP DIPROSES*
──────────────────
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${amount}
📱 *Whatsapp*: ${whatsapp}
💳 *Metode Pembayaran*: ${method}
──────────────────
⏳ *Keterangan*: 
Pembayaran untuk pesanan ini sedang dalam proses verifikasi oleh sistem pembayaran.

🔗 *Detail Pesanan*: ${link}

🔔 *Catatan*: Harap tunggu konfirmasi sebelum memproses pesanan ini.`;
  } else if (status === 'SUCCESS') {
    message = `✅ *TRANSAKSI BERHASIL*
──────────────────
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${amount}
📱 *Whatsapp*: ${whatsapp}
💳 *Metode Pembayaran*: ${method}
──────────────────
🎉 *Keterangan*: 
Transaksi telah berhasil dikonfirmasi. Pesanan sudah diproses.

🔗 *Detail Pesanan*: ${link}

📌 *Catatan*: Mohon segera proses pesanan ini dan perbarui status pengiriman saat dikirim.`;
  } else if (status === 'FAILED') {
    message = `❌ *PEMBAYARAN GAGAL*
──────────────────
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${amount}
📱 *Whatsapp*: ${whatsapp}
💳 *Metode Pembayaran*: ${method}
──────────────────
⚠️ *Keterangan*: 
Pembayaran untuk pesanan ini gagal diproses.

*Kemungkinan penyebab*:
- Dana tidak mencukupi
- Kartu ditolak
- Masalah jaringan
- Pembatasan bank

🔗 *Detail Pesanan*: ${link}

🔔 *Catatan*: Pelanggan telah diberitahu untuk mencoba metode pembayaran lain.`;
  } else {
    message = `📝 *PEMBARUAN PESANAN*
──────────────────
🆔 *ID Pesanan*: ${orderId}
👤 *Pelanggan*: ${customerName}
📦 *Produk*: ${productName}
💰 *Jumlah*: Rp${amount}
📊 *Status*: ${status}
💳 *Metode Pembayaran*: ${method}
──────────────────
📢 *Keterangan*: 
Ada pembaruan pada status pesanan ini.

🔗 *Detail Pesanan*: ${link}

📌 *Catatan*: Mohon periksa dashboard admin untuk informasi lebih lanjut.`;
  }

  return message;
};

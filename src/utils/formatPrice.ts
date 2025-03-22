export function FormatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  // Pastikan input adalah string yang valid
  if (!date) {
    return 'Invalid Date';
  }

  // Konversi string tanggal menjadi objek Date
  const dateObject = new Date(date);

  // Periksa apakah objek Date valid
  if (isNaN(dateObject.getTime())) {
    return 'Invalid Date';
  }

  // Format tanggal menggunakan Intl.DateTimeFormat untuk lokal Indonesia
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta', // Opsional, jika ingin menyesuaikan zona waktu
  }).format(dateObject);

  return formattedDate;
}

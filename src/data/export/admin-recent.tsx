import * as XLSX from "xlsx";

interface ExportProps {
  data: any[]; // Data yang akan diekspor
  fileName: string; // Nama file Excel
  sheetName: string; // Nama sheet
}

export const exportToExcel = ({ data, fileName, sheetName }: ExportProps) => {
  if (!data || data.length === 0) {
    console.warn("Tidak ada data untuk diekspor.");
    return;
  }

  // Konversi data ke worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Buat workbook baru dan tambahkan worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Ekspor workbook sebagai file Excel
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
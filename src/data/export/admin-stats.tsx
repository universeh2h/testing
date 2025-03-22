import * as XLSX from "xlsx";

interface ExportProps {
  data: any; // Data keseluruhan
  fileName: string; // Nama file Excel
}

export const exportToExcelStats = ({ data, fileName }: ExportProps) => {
  if (!data) {
    console.warn("Tidak ada data untuk diekspor.");
    return;
  }

  // Buat workbook baru
  const workbook = XLSX.utils.book_new();

  // 1. Worksheet untuk statistik umum
  const generalStats = [
    { Metric: "Total Transactions", Value: data.totalTransactions },
    { Metric: "Total Revenue", Value: data.totalRevenue },
    { Metric: "Success Rate (%)", Value: data.successRate },
    { Metric: "Active Users", Value: data.activeUsers },
  ];
  const generalStatsSheet = XLSX.utils.json_to_sheet(generalStats);
  XLSX.utils.book_append_sheet(workbook, generalStatsSheet, "Informasi umum");

  // 2. Worksheet untuk distribusi status transaksi
  const transactionsByStatusSheet = XLSX.utils.json_to_sheet(data.transactionsByStatus);
  XLSX.utils.book_append_sheet(workbook, transactionsByStatusSheet, "Transactions by Status");

  // 3. Worksheet untuk distribusi persentase status
  const statusDistributionSheet = XLSX.utils.json_to_sheet(data.statusDistribution);
  XLSX.utils.book_append_sheet(workbook, statusDistributionSheet, "Status Distribution");

  // 4. Worksheet untuk transaksi harian
  const dailyTransactionsSheet = XLSX.utils.json_to_sheet(data.dailyTransactions);
  XLSX.utils.book_append_sheet(workbook, dailyTransactionsSheet, "Daily Transactions");

  // 5. Worksheet untuk transaksi terbaru
  const recentTransactionsFormatted = data.recentTransactions.map((transaction: any) => ({
    ID: transaction.id,
    MerchantOrderID: transaction.merchantOrderId,
    PaymentStatus: transaction.paymentStatus,
    FinalAmount: transaction.finalAmount,
    CreatedAt: transaction.createdAt,
    UpdatedAt: transaction.updatedAt,
    TransactionType: transaction.transactionType,
    Username: transaction.pembelian[0]?.username || "N/A",
    Zone: transaction.pembelian[0]?.zone || "N/A",
    Nickname: transaction.pembelian[0]?.nickname || "N/A",
    Layanan: transaction.pembelian[0]?.layanan || "N/A",
    AccountID: transaction.pembelian[0]?.accountID || "N/A",
  }));
  const recentTransactionsSheet = XLSX.utils.json_to_sheet(recentTransactionsFormatted);
  XLSX.utils.book_append_sheet(workbook, recentTransactionsSheet, "Recent Transactions");

  // Ekspor workbook sebagai file Excel
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
import { TransactionPesanan } from '@/types/transaction';
import { formatDate } from '@/utils/formatPrice';
import * as XLSX from 'xlsx';

interface ExportProps {
  data: TransactionPesanan[] | undefined;
}

export const exportToExcel = ({ data }: ExportProps) => {
  if (!data || data.length === 0) {
    console.warn("Tidak ada data untuk diekspor.");
    return;
  }

  // Format data untuk ekspor
  const formattedData = data.map((transaction) => ({
    ID: transaction.id,
    MerchantOrderID: transaction.merchantOrderId,
    UserID: transaction.userId ?? "N/A",
    OriginalAmount: transaction.originalAmount,
    DiscountAmount: transaction.discountAmount,
    FinalAmount: transaction.finalAmount,
    VoucherID: transaction.voucherId ?? "N/A",
    PaymentStatus: transaction.paymentStatus,
    PaymentCode: transaction.paymentCode,
    PaymentReference: transaction.paymentReference ?? "N/A",
    WhatsApp: transaction.noWa,
    StatusMessage: transaction.statusMessage ?? "N/A",
    CompletedAt: formatDate(transaction.completedAt ?? "N/A") ?? "N/A",
    CreatedAt: formatDate(transaction.createdAt),
    UpdatedAt: formatDate(transaction.updatedAt),
    TransactionType: transaction.transactionType,
    User: transaction.user?.name ?? "N/A", // Asumsi user memiliki properti `name`
  }));

  // Buat worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Buat workbook baru
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Ekspor workbook sebagai file Excel
  XLSX.writeFile(workbook, "transactions.xlsx");
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "./admin-recent";
import { formatDate } from "@/utils/formatPrice";
import { exportToExcelStats } from "./admin-stats";
import { TransactionDashboardData } from "@/types/dashboard";


export function ButtonExport({ data }: { data: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);

    try {
      // Format data untuk ekspor
      const formattedData = data.map((transaction) => ({
        ID: transaction.id,
        MerchantOrderID: transaction.merchantOrderId,
        Status: transaction.paymentStatus,
        Amount: transaction.finalAmount,
        CreatedAt: formatDate(transaction.createdAt),
        UpdatedAt: formatDate(transaction.updatedAt),
        TransactionType: transaction.transactionType,
      }));

      // Panggil fungsi ekspor
      exportToExcel({
        data: formattedData,
        fileName: "Transaction_Export",
        sheetName: "Transactions",
      });
    } catch (error) {
      console.error("Gagal mengekspor data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? (
        <span>Exporting...</span>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Transactions
        </>
      )}
    </Button>
  );
}




export function ButtonExportTransactionStats({ data }: { data: TransactionDashboardData }) {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);

    try {
      // Panggil fungsi ekspor
      exportToExcelStats({
        data,
        fileName: "Transaction_Export",
      });
    } catch (error) {
      console.error("Gagal mengekspor data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? (
        <span>Exporting...</span>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Statistic
        </>
      )}
    </Button>
  );
}
import { Button } from "@/components/ui/button";
import { DetailItem } from "@/features/pages/payment/status/transaction";
import { formatDate } from "@/utils/formatPrice";
import { Printer } from "lucide-react";

export function InvoicePrint({
    data
}  : {
    data : Transaksi
}){
    const handlePrint = () => {
        const printContents = document.getElementById("print-content")?.innerHTML;
        const originalContents = document.body.innerHTML;
      
        if (printContents) {
          document.body.innerHTML = printContents;
          window.print();
          document.body.innerHTML = originalContents;
        }
      };
    return (
<>
        <Button size="sm" onClick={handlePrint} className="gap-1">
        Print
        <Printer className="h-4 w-4" />
      </Button>
        <div id="print-content" className="hidden">
  <div className="p-6">
    <h1 className="text-xl font-bold mb-4">Detail Transaksi</h1>
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Informasi Layanan</h3>
        <div className="space-y-2">
          <DetailItem label="Layanan" value={data.layanan} />
          <DetailItem label="Tipe Transaksi" value={data.tipeTransaksi} />
          <DetailItem
            label="Harga"
            value={`Rp ${data.harga.toLocaleString("id-ID")}`}
            valueClassName="font-semibold text-primary"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Informasi Pengguna</h3>
        <div className="space-y-2">
          <DetailItem label="Username" value={data.username || "-"} />
          <DetailItem label="Nickname" value={data.nickname || "-"} />
          {data.userId && <DetailItem label="User Id" value={data.userId} />}
          {data.zone && <DetailItem label="Zone" value={data.zone} />}
        </div>
      </div>
      {data.pembayaran && (
          <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Informasi Pembayaran</h3>
          <div className="space-y-2">
            <DetailItem label="Status" value={data.pembayaran.status} />
            <DetailItem label="Metode" value={data.pembayaran.metode} />
            <DetailItem label="Waktu" value={formatDate(data.pembayaran.createdAt as string)} />
          </div>
        </div>
      )}
    </div>
  </div>
</div>
      </>
    )
}
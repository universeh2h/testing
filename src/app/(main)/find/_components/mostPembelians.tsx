import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatPrice";

interface FindMostPurchaseProps {
  created_at: string | null
  harga: number;
  order_id: string;
  status: string;
  transaction : {
    noWa  : string 
  } | null
}

export function MostPurchases({ data }: { data: FindMostPurchaseProps[] }) {
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
console.log(data)
  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PROCESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>No. Invoice</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Whatsapp</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((purchase,idx) => (
            <TableRow key={idx}>
              <TableCell>
                {formatDate(purchase.created_at as string)}
              </TableCell>
              <TableCell className="font-medium">{purchase.order_id}</TableCell>
              <TableCell>{formatCurrency(purchase.harga)}</TableCell>
              <TableCell>{(purchase.transaction?.noWa as string)}</TableCell>
              <TableCell className="text-right">
                <Badge className={getStatusColor(purchase.status)}>
                  {purchase.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
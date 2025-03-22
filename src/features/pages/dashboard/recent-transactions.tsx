'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Transaction {
  id: number;
  orderId: string;
  username?: string;
  layanan: string;
  harga: number;
  status: string;
  createdAt?: Date;
  pembayaran?: {
    metode: string;
  };
}

interface RecentTransactionsProps {
  data: Transaction[];
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  // If no data, show empty state
  if (!data.length) {
    return (
      <div className="h-[200px] flex items-center justify-center border rounded-md">
        <p className="text-muted-foreground">No transactions available</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.orderId}</TableCell>
            <TableCell>{transaction.username || 'Anonymous'}</TableCell>
            <TableCell>{transaction.layanan}</TableCell>
            <TableCell>Rp {transaction.harga.toLocaleString()}</TableCell>
            <TableCell>{transaction.pembayaran?.metode || 'N/A'}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  transaction.status === 'success' ? 'default' :
                  transaction.status === 'pending' ? 'destructive' : 'destructive'
                }
              >
                {transaction.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {transaction.createdAt ? 
                format(new Date(transaction.createdAt), 'dd MMM yyyy') : 
                'N/A'
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
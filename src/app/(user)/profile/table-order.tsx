'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { formatDate, FormatPrice } from '@/utils/formatPrice';

export function TableOrder({ search }: { search: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data } = trpc.order.findByUser.useQuery({
    page: currentPage,
    perPage: itemsPerPage,
    search
  });

  const transactions = data?.data || [];
  const totalPages = data?.pagination.totalPages as number 

  console.log(totalPages)

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
        );
      case 'PAID':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>
        );
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-400"
          >
            Pending
          </Badge>
        );
      case 'PROCCES':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        );
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Type</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Terbuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>{transaction.tipeTransaksi}</TableCell>
                  <TableCell>{FormatPrice(transaction.harga)}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>{formatDate(transaction.createdAt as string)}</TableCell>
                  
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-400 text-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-400 text-white"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 
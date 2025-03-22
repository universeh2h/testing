'use client';
import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  XCircle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { FormatPrice } from '@/utils/formatPrice';

// Kolom untuk tabel transaksi
const columns: ColumnDef[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'merchantOrderId',
    header: 'Order ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('merchantOrderId')}</div>
    ),
  },
  {
    accessorKey: 'transactionType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('transactionType');
      return <div>{type || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'finalAmount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('finalAmount'));
      return <div className="font-medium">{FormatPrice(amount)}</div>;
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as string;
      return (
        <div className="flex items-center">
          {status === 'SUCCESS' && (
            <Badge className="bg-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Success
            </Badge>
          )}
          {status === 'PAID' && (
            <Badge className="bg-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Paid
            </Badge>
          )}
          {status === 'PENDING' && (
            <Badge
              variant="outline"
              className="text-yellow-500 border-yellow-500"
            >
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          )}
          {status === 'FAILED' && (
            <Badge variant="destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentCode',
    header: 'Payment Method',
  },
  {
    accessorKey: 'noWa',
    header: 'Phone Number',
    cell: ({ row }) => {
      const phone = row.getValue('noWa');
      return <div>{phone || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            {transaction.invoice && transaction.invoice.length > 0 && (
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View invoice
              </DropdownMenuItem>
            )}
            {transaction.statusMessage && (
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View status message
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download receipt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Komponen DataTable
interface DataTableProps {
  status?: string;
}

export function DataTable({ status }: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });



  const {
    data: transactionData,
    isLoading,
    isError,
  } = trpc.transaction.getCalculatedTransaction.useQuery({
    status,
  }, {
    // Tambahkan refresh dan refetch options
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 detik
  });

  const table = useReactTable({
    data: transactionData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-primary">Loading transaction data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load transaction data. Please try again later.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-card-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-card-foreground">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-card-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {transactionData?.length || 0}{' '}
          transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-card-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-card-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
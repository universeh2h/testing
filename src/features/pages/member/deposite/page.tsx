'use client';

import { useEffect, useState, useRef } from 'react';
import { DepositHeader } from './components/header-deposit';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { GetPaginationNumbers } from '@/utils/pagination';
import { formatDate } from '@/utils/formatPrice';

export function MemberDeposit() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Proper debounce implementation with cleanup
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const { data: depositsData, isLoading } = trpc.deposits.getAll.useQuery({
    page,
    perPage,
    search: debouncedSearch,
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (depositsData?.pagination.hasNextPage) {
      setPage(page + 1);
    }
  };


  return (
    <main className="space-y-6 p-8">
      <DepositHeader
        search={searchQuery}
        onSearchChange={handleSearchChange}
        perPage={perPage}
        setPerPage={setPerPage}
        setPage={setPage}
      />

      {/* Deposits Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : depositsData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No deposits found
                </TableCell>
              </TableRow>
            ) : (
              depositsData?.data.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.username}</TableCell>
                  <TableCell>{deposit.jumlah}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        deposit.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-800'
                          : deposit.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(deposit.createdAt ?? "")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {depositsData && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            {depositsData.data.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
            {(page - 1) * perPage + depositsData.data.length} of{' '}
            {depositsData.pagination.totalCount} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={!depositsData.pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {GetPaginationNumbers({
                page,
                pagination: depositsData.pagination,
              }).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={page === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!depositsData.pagination.hasNextPage}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { HeaderPesanan } from './header-pesanan';
import { trpc } from '@/utils/trpc';
import { RecentTransactions } from '../recent-transactions';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function DashboardPesanan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'PAID' | 'PENDING' | 'FAILED' | 'SUCCESS' | undefined
  >();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounce search input by 1 second
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const { data: transactionsData, isLoading, isError } =
    trpc.pembelian.getAll.useQuery({
      status: statusFilter,
      page: currentPage,
      limit: pageSize,
    });

  // Handle error state
  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">
        Failed to load transactions. Please try again later.
      </div>
    );
  }

  // Calculate total pages
  const totalItems = transactionsData?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <main className="container max-w-5xl w-full mx-auto p-4">
      <HeaderPesanan
        onSearchChange={setSearchTerm}
        data={transactionsData?.transactions}
        onStatusChange={setStatusFilter}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="py-8 text-center text-gray-500">
          Loading transactions...
        </div>
      )}

      {/* No results state */}
      {!isLoading &&
        transactionsData &&
        transactionsData.transactions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No transactions found
          </div>
        )}

      {/* Results */}
      {!isLoading &&
        transactionsData &&
        transactionsData.transactions.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {transactionsData.transactions.map((transaction, index) => {
                return (
                <RecentTransactions
                  key={`${transaction.id}-${index}`}
                  transaction={transaction}
                />
              )})}
            </div>

            {/* Pagination controls */}
            <div className="mt-8 flex items-center justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="text-center text-sm text-gray-500 mt-2">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
              transactions
            </div>
          </>
        )}
    </main>
  );
}
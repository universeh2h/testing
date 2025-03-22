'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { HeaderLayanan } from './header-layanan';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { LayananTable } from './layanan-table';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { Category } from '@/types/category';

export function LayananPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [categoryId, setCategoryId] = useState<string | undefined>('');
  const [status, setStatus] = useState<boolean | undefined>(false);
  const [isFlashSale, setIsFlashSale] = useState<boolean | undefined>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isFetching, error } = trpc.layanans.getAll.useQuery({
    page: currentPage,
    perPage,
    search: debouncedSearchTerm,
    categoryId: categoryId,
    status : status ? 'active' : 'unactive',
    isFlashSale,
  });
  const { data: category } = trpc.main.getCategories.useQuery({
    fields: ['id', 'nama'],
  });

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const layanans = data?.data || [];
  const pagination = data?.pagination || {
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const isLoadingData = isLoading || isFetching;

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto space-y-6 px-4 py-8">
        <HeaderLayanan
          onSearchChange={handleSearchChange}
          data={layanans}
          category={category?.data as Category[]}
          onCategoryChange={setCategoryId}
          onStatusChange={setStatus}
          onFlashSaleChange={setIsFlashSale}
        />

        <div className="rounded-lg border bg-card shadow-sm">
          {error ? (
            <div>errr</div>
          ) : isLoadingData ? (
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ) : layanans.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="rounded-full bg-muted p-3">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Tidak ada layanan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tidak ada layanan yang ditemukan dengan filter yang dipilih.
              </p>
            </div>
          ) : (
            <LayananTable data={layanans} />
          )}
        </div>

        {pagination.totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            perPage={perPage}
            pagination={pagination}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

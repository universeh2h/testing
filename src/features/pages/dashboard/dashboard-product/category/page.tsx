'use client';

import { useEffect, useState } from 'react';
import { HeaderCategory } from './components/header-category';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { trpc } from '@/utils/trpc';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DialogCreateCategory } from './components/dialog-category';
import { DialogDeleteCategory } from './components/dialog-delete';
import { getStatusBadge } from '@/utils/getStatusActive';
import { NotFoundItems } from '@/components/ui/not-found-items';

export function DashboardProductCategory() {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Use tRPC query
  const { data, isLoading, isFetching } = trpc.main.getCategoriesAll.useQuery(
    {
      page: currentPage,
      perPage,
      type: typeFilter,
      status: statusFilter,
      search: debouncedSearchTerm,
    },
    {
      retry: 1,
      staleTime: 5 * 60,
    }
  );

  // Handler functions for HeaderCategory
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string | undefined) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Get data and pagination from query result
  const categories = data?.data || [];
  const pagination = data?.pagination || {
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <div className="space-y-6 p-8">
      <HeaderCategory
        onSearchChange={handleSearchChange}
        onTypeChange={handleTypeChange}
        onStatusChange={handleStatusChange}
      />

      <Card>
        <CardContent className="p-0">
          {/* Loading state */}
          {isLoading && (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Categories table */}
          {!isLoading && categories.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Nama</TableHead>
                  <TableHead className="w-[180px]">Sub Nama</TableHead>
                  <TableHead className="w-[150px]">Brand</TableHead>
                  <TableHead className="w-[100px]">Tipe</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.nama}
                    </TableCell>
                    <TableCell>{category.subNama}</TableCell>
                    <TableCell>{category.brand}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.tipe}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DialogCreateCategory req={category}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </DialogCreateCategory>
                        <DialogDeleteCategory id={category.id}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DialogDeleteCategory>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* No results */}
          {!isLoading && !isFetching && categories.length === 0 && (
            <NotFoundItems />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan{' '}
            <span className="font-medium">
              {(currentPage - 1) * perPage + 1}
            </span>{' '}
            sampai{' '}
            <span className="font-medium">
              {Math.min(currentPage * perPage, pagination.totalCount)}
            </span>{' '}
            dari <span className="font-medium">{pagination.totalCount}</span>{' '}
            kategori
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    !pagination.hasPreviousPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  // Show first page, last page, current page, and pages around current
                  const pageToShow = () => {
                    if (pagination.totalPages <= 5) {
                      return i + 1; // Show all pages if 5 or fewer
                    }

                    if (currentPage <= 3) {
                      // Near start: show first 3, ellipsis, last
                      if (i < 3) return i + 1;
                      if (i === 3) return 'ellipsis';
                      return pagination.totalPages;
                    }

                    if (currentPage >= pagination.totalPages - 2) {
                      // Near end: show first, ellipsis, last 3
                      if (i === 0) return 1;
                      if (i === 1) return 'ellipsis';
                      return pagination.totalPages - (4 - i);
                    }

                    // Middle: show first, ellipsis, current-1, current, current+1, ellipsis, last
                    if (i === 0) return 1;
                    if (i === 1) return 'ellipsis';
                    if (i === 2) return currentPage;
                    if (i === 3) return 'ellipsis';
                    return pagination.totalPages;
                  };

                  const page = pageToShow();

                  if (page === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < pagination.totalPages ? prev + 1 : prev
                    )
                  }
                  className={
                    !pagination.hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

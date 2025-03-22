'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from './pagination';

// Pagination component
export function PaginationComponent({
  currentPage,
  perPage,
  pagination,
  setCurrentPage,
}: {
  currentPage: number;
  perPage: number;
  pagination: {
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted-foreground">
        Menampilkan{' '}
        <span className="font-medium">{(currentPage - 1) * perPage + 1}</span>{' '}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
  );
}

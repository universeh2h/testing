'use client';

import { useEffect, useState } from 'react';
import { HeaderSubCategory } from './components/header-sub-category';
import { trpc } from '@/utils/trpc';
import SubContent from './components/sub-content';
import { SkeletonSubCategories } from './components/skeleton-sub';
import { NotFoundItems } from '@/components/ui/not-found-items';
import { PaginationComponent } from '@/components/ui/pagination-component';

export default function SubCategory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = trpc.sub.getSubAll.useQuery(
    {
      page: currentPage,
      perPage,
      search: debouncedSearchTerm,
    },
    {
      retry: 1,
      gcTime: 10 * 60 * 60,
      staleTime: 10 * 60 * 60,
      refetchOnWindowFocus: false,
    }
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const subCategories = data?.data || [];
  const pagination = data?.pagination || {
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
    <main className="space-y-6 p-8">
      <HeaderSubCategory onSearchChange={handleSearchChange} />

      {isLoading || isFetching ? (
        <SkeletonSubCategories />
      ) : subCategories.length > 0 ? (
        <>
          <SubContent data={subCategories} />
          <PaginationComponent
            currentPage={currentPage}
            perPage={perPage}
            pagination={pagination}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <NotFoundItems />
      )}
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { HeaderVoucher } from './header-voucher';
import { trpc } from '@/utils/trpc';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from 'lucide-react';
import { VoucherCards } from './voucher-cards';

export function VoucherPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const { data, isLoading } = trpc.voucher.getAll.useQuery({
    code: debouncedSearchTerm,
    category: activeTab,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <HeaderVoucher
        onChange={handleSearchChange}
        setActiveTab={setActiveTab}
      />

      <div className="m-8">
        <h2 className="text-2xl font-bold mb-4">Available Vouchers</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border">
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((voucher) => (
              <VoucherCards key={voucher.id} voucher={voucher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No vouchers found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : 'There are no available vouchers at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

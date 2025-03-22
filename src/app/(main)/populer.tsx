'use client';

import PopularSkeleton from '@/components/ui/popular-skeleton';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import Link from 'next/link';

export function PopularSection() {
  const { data, isLoading } = trpc.main.getCategoriesPopular.useQuery();

  // Jika sedang loading, tampilkan skeleton loader
  if (isLoading) {
    return <PopularSkeleton />;
  }

  // Jika tidak ada data, kembalikan null
  if (!data || data.length === 0) {
    return null;
  }

  // Render data jika sudah tersedia
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Popular</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((category) => (
          <Link
            href={`/order/${category.kode}`}
            key={category.id}
            className="group bg-blue-600/10 overflow-hidden rounded-lg border border-transparent hover:border-blue-500 transition-all duration-200"
          >
            <div className="flex space-x-2 p-2 items-center shadow-md shadow-blue-200">
              <div className="relative overflow-hidden rounded-md">
                <Image
                  src={category.thumbnail}
                  width={100}
                  height={100}
                  alt={`${category.nama} thumbnail`}
                  className="object-cover size-16 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-white">
                <h3 className="text-xs md:text-sm truncate max-w-[80px] md:max-w-full">
                  {category.nama}
                </h3>
                <p className="text-xs">{category.subNama}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

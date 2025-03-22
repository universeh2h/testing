'use client';
import { useRef } from 'react';

export function SkeletonCardCategories({ count = 10 }: { count: number }) {
  const items = useRef(Array.from({ length: count }, (_, i) => i));

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  xl:grid-cols-5 gap-5">
      {items.current.map((_, index) => (
        <div
          key={index}
          className="relative rounded-xl overflow-hidden animate-pulse"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900"></div>

            {/* Skeleton for title and subtitle */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div>
                <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              </div>

              {/* Skeleton for action button */}
              <div>
                <div className="h-7 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Skeleton border effect */}
          <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-xl"></div>

          {/* Skeleton corner accent */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-gray-200 dark:border-r-gray-700"></div>
        </div>
      ))}
    </section>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import { trpc } from '@/utils/trpc';
import type { Category } from '@/types/category';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SkeletonCardCategories } from '@/components/ui/category-skeleton';

export default function AllCategories({ type }: { type: string }) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  // Reset pagination when type changes
  useEffect(() => {
    setPage(1);
    setAllCategories([]);
    setHasMore(true);
  }, [type]);

  const { data, isLoading, isFetching } =
    trpc.main.getCategoriesActive.useQuery({
      page: page.toString(),
      perPage: '10',
      type: type,
    });

  useEffect(() => {
    if (data) {
      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      // Filter categories by the selected type
      const filteredData = data.data.filter((category) =>
        type === 'all' ? true : category.tipe === type
      );

      if (page === 1) {
        setAllCategories(filteredData);
      } else {
        setAllCategories((prev) => [...prev, ...filteredData]);
      }

      setHasMore(data.meta.hasNextPage);
    }
  }, [data, page, type]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !isLoading && !isFetching) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, isFetching]);

  return (
    <>
      {isLoading && page === 1 ? (
        <SkeletonCardCategories count={10} />
      ) : (
        <>
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {allCategories.map((category, index) => (
              <Link
                href={`/order/${category.kode}`}
                key={`${category.nama}-${index}`}
                className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Card with image as background and text overlay */}
                <div className="relative aspect-square overflow-hidden">
                  {/* Background Image */}
                  <Image
                    src={category.thumbnail}
                    alt={`${category.nama} thumbnail`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Permanent dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

                  {/* Text content positioned on top of the image */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                    {/* Top section with category name */}
                    <div className="transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                      <h3 className="font-semibold text-white text-lg group-hover:text-orange-500 transition-colors duration-300">
                        {category.nama}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {category.subNama}
                      </p>
                    </div>

                    {/* Bottom section with action button */}
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
                        Beli Sekarang <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-xl transition-colors duration-300 pointer-events-none"></div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-primary/0 group-hover:border-r-primary/80 transition-all duration-300"></div>
              </Link>
            ))}
          </section>

          {hasMore && (
            <div ref={loader} className="flex justify-center my-12">
              {isFetching ? (
                <SkeletonCardCategories count={5} />
              ) : (
                <div className="h-8"></div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

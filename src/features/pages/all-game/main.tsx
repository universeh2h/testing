'use client';

import { BannerSlider } from '@/app/(main)/banner';
import Categories from '@/app/(main)/categories';

export default function AllGamePage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <BannerSlider />
      <Categories />
    </main>
  );
}

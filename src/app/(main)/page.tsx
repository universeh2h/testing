import { PopularSection } from './populer';

import Categories from './categories';
import { BannerSlider } from './banner';

export default async function Home() {
  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* banner */}
        <BannerSlider />
        {/* popular */}
        <section className="py-8">
          <PopularSection />
        </section>
        <Categories />
      </main>
    </>
  );
}

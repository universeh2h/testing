'use client';
import { trpc } from '@/utils/trpc';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function BannerSlider() {
  const bannerQuery = trpc.main.getBanners.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const backgroundUrl =
    'https://res.cloudinary.com/dstvymie8/image/upload/v1741104865/download_1_bzlrrj.webp';

  useEffect(() => {
    if (!autoplay || !bannerQuery.data?.data?.banners.length) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === (bannerQuery.data?.data?.banners.length || 1) - 1
          ? 0
          : prevIndex + 1
      );
    }, 5000); // ganti slide setiap 5 menit

    return () => clearInterval(interval);
  }, [autoplay, bannerQuery.data?.data?.banners.length]);

  useEffect(() => {
    if (autoplay) return;

    const timeout = setTimeout(() => {
      setAutoplay(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [autoplay]);

  if (!bannerQuery.data?.data?.banners.length) {
    return null;
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative w-full py-8 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full">
        <div className="relative h-full flex items-center z-10">
          <div className="relative w-full h-64 md:h-96 overflow-hidden">
            {/* Slider */}
            <div className="relative w-full h-full">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full h-full"
                >
                  <Image
                    width={1000}
                    height={200}
                    src={bannerQuery.data?.data.banners[currentIndex]?.path}
                    alt={`Banner ${currentIndex + 1}`}
                    className="w-full  h-full  rounded-md sm:bg-cover
              "
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
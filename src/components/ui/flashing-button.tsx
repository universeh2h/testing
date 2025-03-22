'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor } from 'lucide-react';

export const FlashingButton = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Set up the interval
    const interval = setInterval(() => {
      setIsActive(true);

      // Reset after a short delay (e.g., 700ms)
      setTimeout(() => {
        setIsActive(false);
      }, 700); // Slightly longer "on" time
    }, 5000); // Flash every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Button
      size="lg"
      className={`gap-2 font-medium rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-orange-300 text-orange-900 shadow-lg shadow-orange-300/70 scale-110 ring-4 ring-orange-400/50'
          : 'bg-orange-500 hover:bg-orange-700'
      }`}
    >
      <Monitor className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
      <span>Upgrade Sekarang</span>
    </Button>
  );
};

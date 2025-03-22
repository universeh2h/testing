'use client';

import { useState, useMemo } from 'react';

export function MagicWheelPage() {
  const [magicWheelPoint, setMagicWheelPoint] = useState<number | null>(null);

  const diamondsNeeded = useMemo(() => {
    if (
      magicWheelPoint === null ||
      magicWheelPoint < 0 ||
      magicWheelPoint > 200
    )
      return null;
    if (magicWheelPoint < 196) {
      const remainingPoints = 200 - magicWheelPoint;
      const requiredSpins = Math.ceil(remainingPoints / 5);
      return requiredSpins * 270;
    } else {
      return (200 - magicWheelPoint) * 60;
    }
  }, [magicWheelPoint]);

  return (
    <main className="min-h-screen bg-[#001435] text-white flex justify-center items-center">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          Magic Wheel Calculator
        </h1>

        {/* Input Magic Wheel Point */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Magic Wheel Point (0 - 200)
          </label>
          <input
            type="number"
            value={magicWheelPoint ?? ''}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setMagicWheelPoint(
                isNaN(value) ? null : Math.min(Math.max(value, 0), 200)
              );
            }}
            min="0"
            max="200"
            placeholder="Masukkan poin..."
            className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
          />
        </div>

        {/* Hasil Perhitungan */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Diamonds Needed
          </label>
          <input
            type="text"
            value={diamondsNeeded !== null ? diamondsNeeded : ''}
            readOnly
            className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 cursor-not-allowed"
            placeholder="Hasil akan muncul di sini..."
          />
        </div>

        {/* Penjelasan */}
        <p className="text-sm text-gray-400">
          Masukkan poin Magic Wheel Anda (0 - 200), dan kalkulator ini akan
          menentukan jumlah diamond yang dibutuhkan untuk mencapai 200 poin.
        </p>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';

export function ZodiacCalculator() {
  const [zodiacPoint, setZodiacPoint] = useState<number | ''>('');
  const [diamondsNeeded, setDiamondsNeeded] = useState<number | ''>('');

  // Fungsi untuk menghitung diamond yang dibutuhkan
  const calculateDiamonds = (point: number) => {
    if (point < 90) {
      return Math.ceil(((2000 - point * 20) * 850) / 1000);
    } else {
      return Math.ceil(2000 - point * 20);
    }
  };

  // Perhitungan otomatis saat `zodiacPoint` berubah
  useEffect(() => {
    if (zodiacPoint === '') {
      setDiamondsNeeded('');
    } else {
      setDiamondsNeeded(calculateDiamonds(zodiacPoint));
    }
  }, [zodiacPoint]);

  return (
    <main className="min-h-screen bg-[#001435] text-white flex justify-center items-center">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          Zodiac Calculator
        </h1>

        {/* Input Zodiac Point */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Zodiac Point (0 - 100)
          </label>
          <input
            type="number"
            value={zodiacPoint}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setZodiacPoint(Math.min(Math.max(value, 0), 100)); // Batasi input antara 0 - 100
              } else {
                setZodiacPoint('');
              }
            }}
            min="0"
            max="100"
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
            value={diamondsNeeded !== '' ? diamondsNeeded : ''}
            readOnly
            className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 cursor-not-allowed"
            placeholder="Hasil akan muncul di sini..."
          />
        </div>

        {/* Penjelasan */}
        <p className="text-sm text-gray-400">
          Masukkan Zodiac Point Anda (0 - 100), dan kalkulator ini akan
          menentukan jumlah diamond yang dibutuhkan untuk mencapai target.
        </p>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';

export function HitungWinRate() {
  const [tMatch, setTMatch] = useState('');
  const [tWr, setTWr] = useState('');
  const [wrReq, setWrReq] = useState('');
  const [result, setResult] = useState<number | null>(null);

  function rumus(tMatch: number, tWr: number, wrReq: number) {
    const tWin = tMatch * (tWr / 100);
    const tLose = tMatch - tWin;
    const sisaWr = 100 - wrReq;
    const wrResult = 100 / sisaWr;
    const seratusPersen = tLose * wrResult;
    const final = seratusPersen - tMatch;
    return Math.round(final);
  }

  function handleCalculate() {
    if (!tMatch || !tWr || !wrReq) return;
    const resultNum = rumus(Number(tMatch), Number(tWr), Number(wrReq));
    setResult(resultNum);
  }

  return (
    <main className=" text-white">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">
          Win Rate Calculator
        </h1>

        <div className="space-y-6">
          {/* Input fields */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                placeholder="Total Matches"
                value={tMatch}
                onChange={(e) => setTMatch(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Current Win Rate (%)"
                value={tWr}
                onChange={(e) => setTWr(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Target Win Rate (%)"
                value={wrReq}
                onChange={(e) => setWrReq(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg"
          >
            Hitung Win Rate
          </button>

          {/* Result display */}
          {result !== null && (
            <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-lg">
                Anda memerlukan{' '}
                <span className="font-bold text-cyan-400">{result} win</span>{' '}
                tanpa lose untuk mencapai{' '}
                <span className="font-bold text-cyan-400">{wrReq}%</span> WR
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

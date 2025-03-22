'use client';
import { trpc } from '@/utils/trpc';
import { FormatPrice } from '@/utils/formatPrice';

// Helper function untuk masking sensitive data
function maskOrderId(orderId: string) {
  if (!orderId) return '-';
  const firstThree = orderId.substring(0, 3);
  return `${firstThree}***`;
}

export function LeaderboardPage() {
  // Fetch semua data transaksi sekaligus
  const { data: allData, isLoading: loadingAllData } =
    trpc.pembelian.getAllPembelianData.useQuery();

  if (loadingAllData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-cyan-500"></div>
      </div>
    );
  }

  // Data categories
  const todayTransactions = allData?.expensive?.today || [];
  const weekTransactions = allData?.expensive?.week || [];
  const monthTransactions = allData?.expensive?.month || [];

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-white text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Leaderboard Transaksi
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hari Ini */}
        <LeaderboardCard
          title="Hari Ini"
          transactions={todayTransactions}
          emptyMessage="Belum ada transaksi hari ini"
        />

        {/* Minggu Ini */}
        <LeaderboardCard
          title="Minggu Ini"
          transactions={weekTransactions}
          emptyMessage="Belum ada transaksi minggu ini"
        />

        {/* Bulan Ini */}
        <LeaderboardCard
          title="Bulan Ini"
          transactions={monthTransactions}
          emptyMessage="Belum ada transaksi bulan ini"
        />
      </div>
    </main>
  );
}

// Komponen reusable untuk kartu leaderboard
function LeaderboardCard({
  title,
  transactions,
  emptyMessage,
}: {
  title: string;
  transactions: any[];
  emptyMessage: string;
}) {
  return (
    <div className='relative mb-7'>
    <div className="bg-gray-900  border border-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
     <div className='top-0 absolute left-0 w-fit'>
        TOP {title}
     </div>
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.orderId}
              className="flex justify-between items-center "
              >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-cyan-400">
                  #{index + 1}
                </span>
                <span className="text-gray-300 text-sm">{maskOrderId(transaction.orderId)}</span>
              </div>
              <div className="text-sm font-semibold text-green-400">
                {FormatPrice(parseInt(transaction.harga))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-6">
          {emptyMessage}
        </div>
      )}
    </div>
              </div>
  );
}
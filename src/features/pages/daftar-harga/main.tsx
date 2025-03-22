'use client';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { FormatPrice } from '@/utils/formatPrice';

export type LayananType = {
  id: number;
  layanan: string;
  status: boolean
  harga: number;
};

export function DaftarHargaPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const perPage = 10;
  const [allLayanans, setAllLayanans] = useState<LayananType[]>([]);
  const [draftQuery, setDraftQuery] = useState(''); // State sementara

  // Create a ref that will detect when the element is visible
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Fetch layanans data using your tRPC endpoint with useQuery
  const { data, isLoading, isFetching } = trpc.layanans.getLayanans.useQuery(
    {
      page: page.toString(),
      perPage: perPage.toString(),
      search: searchQuery, // Kirim query pencarian
      status: statusFilter !== 'all' ? statusFilter : undefined, // Kirim filter status
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(draftQuery); // Update setelah delay
    }, 3000); // 300ms jeda

    return () => clearTimeout(handler); // Bersihkan timeout
  }, [draftQuery]); // Jalankan saat draftQuery berubah

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  // Dan perlu diperbarui cara akses data karena struktur data berubah
  useEffect(() => {
    if (data && data.data) {
      if (page === 1) {
        setAllLayanans(data.data);
      } else {
        // Append new data to existing data, avoiding duplicates
        setAllLayanans((prev) => {
          const newItems = data.data.filter(
            (newItem) =>
              !prev.some((existingItem) => existingItem.id === newItem.id)
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  useEffect(() => {
    if (
      inView &&
      !isLoading &&
      !isFetching &&
      data &&
      page < data.pagination.pageCount // 🎯 Perbaikan di sini
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, isLoading, isFetching, data, page]); // 📌 Tambahkan page di dependencies

  const handleStatusFilter = (status  : string) => {
    setStatusFilter(status);
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <main style={{ background: '#001435' }} className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header and filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
              Daftar Harga Layanan
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
                  value={draftQuery} // Gunakan draftQuery sebagai nilai input
                  onChange={(e) => {
                    setDraftQuery(e.target.value); // Update draftQuery langsung
                    setPage(1); // Tetap reset halaman
                  }}
                />
              </div>

              {/* Filter dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                >
                  <Filter className="h-5 w-5 text-cyan-400" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleStatusFilter('all')}
                        className={`block px-4 py-2 text-left w-full hover:bg-gray-700 ${
                          statusFilter === 'all'
                            ? 'bg-cyan-900 text-cyan-300'
                            : 'text-white'
                        }`}
                      >
                        Semua Status
                      </button>
                      <button
                        onClick={() => handleStatusFilter('active')}
                        className={`block px-4 py-2 text-left w-full hover:bg-gray-700 ${
                          statusFilter === 'active'
                            ? 'bg-cyan-900 text-cyan-300'
                            : 'text-white'
                        }`}
                      >
                        Aktif
                      </button>
                      <button
                        onClick={() => handleStatusFilter('inactive')}
                        className={`block px-4 py-2 text-left w-full hover:bg-gray-700 ${
                          statusFilter === 'inactive'
                            ? 'bg-cyan-900 text-cyan-300'
                            : 'text-white'
                        }`}
                      >
                        Tidak Aktif
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Filter aktif:</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-cyan-900/50 text-cyan-300 rounded-md">
                <span>
                  {statusFilter === 'ACTIVE'
                    ? 'Aktif'
                  
                    
                    : 'Tidak Aktif'}
                </span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="ml-1 text-cyan-300 hover:text-cyan-100"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Table view for layanans */}
        <section className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-cyan-300">No</th>
                <th className="px-6 py-4 text-cyan-300">Layanan</th>
                <th className="px-6 py-4 text-cyan-300">Harga</th>
                <th className="px-6 py-4 text-cyan-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && page === 1 ? (
                // Skeleton loader when first loading
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 animate-pulse"
                  >
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-700 rounded w-8"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-700 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </td>
                  </tr>
                ))
              ) : allLayanans.length > 0 ? (
                allLayanans.map((layanan, index) => (
                  <tr
                    key={layanan.id}
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{layanan.layanan}</td>
                    <td className="px-6 py-4 font-bold text-cyan-400">
                      {FormatPrice(layanan.harga)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          layanan.status    
                            ? 'bg-green-900/40 text-green-400'
                        
                            : 'bg-red-900/40 text-red-400'
                        }`}
                      >
                        {layanan.status? 'akktif'  :   'nonaktif'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Tidak ada layanan yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Loading indicator and intersection observer target */}
          <div ref={ref} className="py-6 flex justify-center">
            {isFetching && page > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            )}
          </div>
        </section>

        {/* Card view alternative for mobile */}
        <section className="grid gap-4 md:hidden">
          {isLoading && page === 1 ? (
            // Skeleton loader when first loading
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : allLayanans.length > 0 ? (
            allLayanans.map((layanan) => (
              <div
                key={layanan.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
              >
                <h3 className="font-medium text-lg mb-2">{layanan.layanan}</h3>
                <p className="text-xl font-bold text-cyan-400 mb-2">
                  {FormatPrice(layanan.price)}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    layanan.status
                      ? 'bg-green-900/40 text-green-400'
                      : 
                      'bg-red-900/40 text-red-400'
                  }`}
                >
                  {layanan.status 
                    ? 'Aktif'
                  
                    : 'Tidak Aktif'}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
              <p>Tidak ada layanan yang ditemukan</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

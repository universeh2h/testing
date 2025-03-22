import React from 'react';

export default function CaraTopUp() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#001435] rounded-xl shadow-lg text-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-300 mb-2">Cara Top Up</h1>
        <p className="text-blue-200">Berikut adalah panduan lengkap untuk melakukan top up di website kami</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Langkah 1 */}
        <div className="bg-[#002050] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-900">
          <div className="bg-blue-800 py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="bg-blue-200 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">
                1
              </div>
              <h3 className="text-white font-bold text-lg">Login ke Akun Anda</h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-blue-100">Masuk ke akun Anda menggunakan email dan kata sandi.</p>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className="bg-[#002050] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-900">
          <div className="bg-blue-800 py-3 px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-200 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">
                2
              </div>
              <h3 className="text-white font-bold text-lg">Pilih Game</h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-blue-100">Pilih game yang ingin Anda top up dari daftar yang tersedia.</p>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className="bg-[#002050] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-900">
          <div className="bg-blue-800 py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="bg-blue-200 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">
                3
              </div>
              <h3 className="text-white font-bold text-lg">Masukkan Jumlah</h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-blue-100">Masukkan jumlah saldo yang ingin Anda top up.</p>
          </div>
        </div>

        {/* Langkah 4 */}
        <div className="bg-[#002050] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-900">
          <div className="bg-blue-800 py-3 px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-200 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">
                4
              </div>
              <h3 className="text-white font-bold text-lg">Pilih Metode Pembayaran</h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-blue-100">Pilih metode pembayaran yang tersedia, seperti transfer bank atau e-wallet.</p>
          </div>
        </div>

        {/* Langkah 5 */}
        <div className="bg-[#002050] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-blue-900 w-full">
          <div className="bg-blue-800 py-3 px-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-200 h-10 w-10 rounded-full flex items-center justify-center text-blue-800 font-bold text-xl">
                5
              </div>
              <h3 className="text-white font-bold text-lg">Konfirmasi Pembayaran</h3>
            </div>
          </div>
          <div className="p-5">
            <p className="text-blue-100">Selesaikan pembayaran dan tunggu proses verifikasi. Saldo akan otomatis ditambahkan ke akun game Anda.</p>
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="mt-8 bg-blue-900 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-blue-200 font-medium">Jika Anda mengalami masalah, silakan hubungi tim dukungan kami.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
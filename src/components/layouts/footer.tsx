'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WhatsAppButton } from '../ui/button-wa';

export function Footer() {
  const { data, isLoading, error } = trpc.methods.getMethods.useQuery();
  const paymentMethods = data?.data || [];
  const {data : settingWeb}   = trpc.setting.getConfig.useQuery()

  // Duplikasi array untuk efek scrolling tak terbatas
  const duplicatedMethods = [...paymentMethods, ...paymentMethods];
  
  // Referensi untuk lebar container
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <footer className="pt-20 pb-12 relative" aria-label="Footer Vazzuniverse">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Informasi Perusahaan */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Vazzuniverse</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform terpercaya untuk kredit game, diamond, dan langganan berbagai game populer di Indonesia.
            </p>
         
          </div>

          {/* Link Game */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Game Populer</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/order/mobile-legend"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mobile Legends Bang Bang
                </Link>
              </li>
              <li>
                <Link
                  href="/order/pubg-mobile"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  PUBG Mobile
                </Link>
              </li>
              <li>
                <Link
                  href="/order/free-fire"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Free Fire
                </Link>
              </li>
            
              <li>
                <Link
                  href="/valorant"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Valorant
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Bantuan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Bantuan</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/cara-top-up"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cara Top Up
                </Link>
              </li> 
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Metode Pembayaran - Slider Framer Motion */}
        <div className="mt-12">
          <Separator className="mb-8 bg-gray-700" />
          <div className="relative overflow-hidden py-2" ref={containerRef}>
            {isLoading ? (
              <div className="text-gray-400 py-4">
                Memuat metode pembayaran...
              </div>
            ) : error ? (
              <div className="text-red-400 py-4">
                Gagal memuat metode pembayaran
              </div>
            ) : (
              <motion.div
                className="flex gap-10"
                animate={{
                  x: [0, -1500],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                  duration: 20,
                  ease: 'linear',
                }}
              >
                {/* First set of payment methods */}
                {duplicatedMethods.length > 0 ? (
                  duplicatedMethods.map((method, index) => (
                    <div
                      key={`${method.id}-${index}`}
                      className="flex flex-col items-center min-w-[100px]"
                    >
                      <div className="h-12 w-20 flex items-center justify-center">
                        <Image
                          width={80}
                          height={48}
                          src={method.images}
                          alt={`Pembayaran dengan ${method.name}`}
                          className="h-auto w-auto max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  // Metode pembayaran cadangan jika tidak ada data
                  <>
                    {[
                      { id: 'visa', name: 'Visa' },
                      { id: 'mastercard', name: 'Mastercard' },
                      { id: 'paypal', name: 'PayPal' },
                      { id: 'bca', name: 'Bank BCA' },
                      { id: 'bni', name: 'Bank BNI' },
                      { id: 'bri', name: 'Bank BRI' },
                      { id: 'mandiri', name: 'Bank Mandiri' },
                      { id: 'gopay', name: 'GoPay' },
                      { id: 'dana', name: 'DANA' },
                      { id: 'ovo', name: 'OVO' },
                      { id: 'linkaja', name: 'LinkAja' },
                      { id: 'shopeepay', name: 'ShopeePay' },
                      // Duplikasi untuk efek berkelanjutan
                      { id: 'visa-2', name: 'Visa' },
                      { id: 'mastercard-2', name: 'Mastercard' },
                      { id: 'paypal-2', name: 'PayPal' },
                      { id: 'bca-2', name: 'Bank BCA' },
                      { id: 'bni-2', name: 'Bank BNI' },
                      { id: 'bri-2', name: 'Bank BRI' },
                      { id: 'mandiri-2', name: 'Bank Mandiri' },
                      { id: 'gopay-2', name: 'GoPay' },
                      { id: 'dana-2', name: 'DANA' },
                      { id: 'ovo-2', name: 'OVO' },
                      { id: 'linkaja-2', name: 'LinkAja' },
                      { id: 'shopeepay-2', name: 'ShopeePay' },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className="flex flex-col items-center min-w-[100px]"
                      >
                        <div className="h-12 w-20 flex items-center justify-center">
                          <Image
                            width={80}
                            height={48}
                            src="/placeholder.svg?height=48&width=80"
                            alt={`Pembayaran dengan ${method.name}`}
                            className="h-auto max-h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

             {/* Copyright */}
        <div className="mt-8">
          <Separator className="mb-6 bg-gray-700" />
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Vazzuniverse. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-center text-gray-500 text-xs mt-2">
            Mobile Legends Bang Bang adalah merek dagang terdaftar dari Moonton. Vazzuniverse bukan afiliasi resmi dari Moonton.
          </p>
        </div>
      </div>
      <WhatsAppButton image={settingWeb?.logo_cs as string}/>
    </footer>
  );
}
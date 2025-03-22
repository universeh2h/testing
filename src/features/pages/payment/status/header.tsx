'use client';
import { CheckCircle2, AlertCircle, Wallet, CreditCard, Cog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeaderPaymentStatusProps {
  status: string;
}

export function HeaderPaymentStatus({ status }: HeaderPaymentStatusProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (status === 'PENDING') {
      const interval = setInterval(() => {
        setAnimate((prev) => !prev);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <section
      className="w-full rounded-xl overflow-hidden relative"
      style={{ background: '#001435' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/10 blur-xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-purple-500/10 blur-xl"></div>
        <div className="absolute right-1/4 bottom-0 w-32 h-32 rounded-full bg-yellow-500/10 blur-lg"></div>

        {/* Animated lines */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="opacity-20">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: '#4F46E5', stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: '#06B6D4', stopOpacity: 0.6 }}
                />
              </linearGradient>
            </defs>
            <path
              d="M0,64 Q50,0 100,64 T200,64 T300,64 T400,64"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0,128 Q50,64 100,128 T200,128 T300,128 T400,128"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 px-4 text-white relative z-10">
        {/* Icon container with glowing effect */}
        <div
          className={cn(
            'relative flex items-center justify-center',
            status === 'PENDING' && 'text-yellow-400',
            status === 'PAID' && 'text-blue-400',
            status === 'PROCESS' && 'text-amber-400',
            status === 'SUCCESS' && 'text-green-400',
            status === 'FAILED' && 'text-red-400'
          )}
        >
          {/* Glow effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-xl opacity-30',
              status === 'PENDING' && 'bg-yellow-400',
              status === 'PAID' && 'bg-blue-400',
              status === 'PROCESS' && 'bg-amber-400',
              status === 'SUCCESS' && 'bg-green-400',
              status === 'FAILED' && 'bg-red-400'
            )}
          ></div>

          {/* PENDING - Animated wallet */}
          {status === 'PENDING' && (
            <div
              className={cn(
                'transition-transform duration-1500 ease-in-out relative',
                animate ? 'transform translate-y-2' : 'transform -translate-y-2'
              )}
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20"></div>
              <Wallet className="h-28 w-28 relative z-10" strokeWidth={1.5} />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full blur-sm"></div>
            </div>
          )}

          {/* PAID - Credit card icon */}
          {status === 'PAID' && (
            <div className="animate-pulse relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20"></div>
              <CreditCard
                className="h-28 w-28 relative z-10"
                strokeWidth={1.5}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full blur-sm"></div>
            </div>
          )}

          {/* PROCESS - Gear icon */}
          {status === 'PROCESS' && (
            <div className="animate-spin relative">
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20"></div>
              <Cog className="h-28 w-28 relative z-10" strokeWidth={1.5} />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full blur-sm"></div>
            </div>
          )}

          {/* SUCCESS - Check circle */}
          {status === 'SUCCESS' && (
            <div className="animate-bounce relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20"></div>
              <CheckCircle2
                className="h-28 w-28 relative z-10"
                strokeWidth={1.5}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full blur-sm"></div>
            </div>
          )}

          {/* FAILED - Alert circle */}
          {status === 'FAILED' && (
            <div className="animate-pulse relative">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-20"></div>
              <AlertCircle
                className="h-28 w-28 relative z-10"
                strokeWidth={1.5}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent rounded-full blur-sm"></div>
            </div>
          )}
        </div>

        {/* Status text with gradient */}
        <div className="mt-8 text-center">
          <h2
            className={cn(
              'text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r',
              status === 'PENDING' && 'from-yellow-300 to-yellow-500',
              status === 'PAID' && 'from-blue-300 to-blue-500',
              status === 'PROCESS' && 'from-amber-300 to-amber-500',
              status === 'SUCCESS' && 'from-green-300 to-green-500',
              status === 'FAILED' && 'from-red-300 to-red-500',
              !['PENDING', 'PAID', 'PROCESS', 'SUCCESS', 'FAILED'].includes(status) &&
                'from-gray-300 to-gray-500'
            )}
          >
            {status === 'PENDING' && 'Menunggu Pembayaran '}
            {status === 'PAID' && 'Pembayaran Diterima'}
            {status === 'PROCESS' && 'Pembayaran Diproses'}
            {status === 'SUCCESS' && 'Pembayaran Berhasil'}
            {status === 'FAILED' && 'Pembayaran Gagal'}
            {!['PENDING', 'PAID', 'PROCESS', 'SUCCESS', 'FAILED'].includes(status) &&
              'Status Pembayaran'}
          </h2>
          {status === 'PENDING' && (
            <p className="text-md mt-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
              Silahkan Melakukan Pembayaran Dengan Metode Yang Kamu Pilih
            </p>
          )}
        </div>

        {/* Modern progress indicator */}
        <div className="mt-6 flex items-center space-x-1">
          <div
            className={cn(
              'h-1 w-16 rounded-full transition-all duration-300',
              status === 'PENDING' ? 'bg-yellow-400' : 'bg-white/20',
              status === 'PAID' || status === 'PROCESS' || status === 'SUCCESS' ? 'bg-blue-400' : ''
            )}
          ></div>
          <div
            className={cn(
              'h-1 w-16 rounded-full transition-all duration-300',
              status === 'PAID' ? 'bg-blue-400' : 'bg-white/20',
              status === 'PROCESS' || status === 'SUCCESS' ? 'bg-amber-400' : ''
            )}
          ></div>
          <div
            className={cn(
              'h-1 w-16 rounded-full transition-all duration-300',
              status === 'SUCCESS' ? 'bg-green-400' : 'bg-white/20'
            )}
          ></div>
        </div>
      </div>
    </section>
  );
}
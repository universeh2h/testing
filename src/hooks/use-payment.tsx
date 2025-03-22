/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard, Store, Wallet } from 'lucide-react';
import { JSX } from 'react';
// hooks/use-duitku-payment.ts
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PaymentDetails } from '@/types/payment';
import { RequestPayment } from '@/app/api/payment/initiate/route';

export const typeLabels: Record<string, string> = {
  'virtual-account': 'Virtual Account',
  'e-walet': 'E-Wallet',
  'convenience-store': 'Convenience Store',
};

// Icons for payment types
export const typeIcons: Record<string, JSX.Element> = {
  'virtual-account': <CreditCard className="h-5 w-5 text-blue-300" />,
  'e-walet': <Wallet className="h-5 w-5 text-blue-300" />,
  'convenience-store': <Store className="h-5 w-5 text-blue-300" />,
};

export function useMidtransPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();

  const initiatePayment = async (
    orderDetails: RequestPayment
  ): Promise<PaymentDetails> => {
    setIsLoading(true);
    setError(null);
        try {
      const response = await axios.post<PaymentDetails>(
        '/api/payment/initiate',
        orderDetails
      );
      const url = `/invoice?invoice=${response.data.merchantOrderId}`;
      push(url);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Payment initiation failed');
      throw new Error(
        err?.response?.data?.message || 'Payment initiation failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
  };
}

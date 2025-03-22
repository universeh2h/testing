'use client';

import { useParams } from 'next/navigation';
import { HeaderInvoices } from './header';
import { trpc } from '@/utils/trpc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CopyIcon, Download, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormatPrice } from '@/utils/formatPrice';
import Image from 'next/image';

// Custom color styles for dark background (#001435)
const styles = {
  background: 'bg-[#001435]',
  card: 'bg-[#002255] border-[#1a3665] text-white',
  cardHeader: 'text-white',
  cardDescription: 'text-blue-200',
  heading: 'text-white',
  subheading: 'text-blue-200',
  text: 'text-gray-100',
  mutedText: 'text-blue-300',
  button: 'bg-blue-500 hover:bg-blue-600 text-white',
  buttonOutline: 'border-blue-400 text-blue-300 hover:bg-blue-900',
  buttonGhost: 'text-blue-200 hover:bg-blue-900 hover:text-white',
  separator: 'bg-[#1a3665]',
  highlight: 'text-blue-300',
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-900 text-yellow-100';
    case 'PAID':
    case 'SUCCESS':
      return 'bg-green-900 text-green-100';
    case 'FAILED':
    case 'EXPIRED':
      return 'bg-red-900 text-red-100';
    default:
      return 'bg-gray-800 text-gray-100';
  }
};

export function InvoicePage() {
  const { slug } = useParams();
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { data, isLoading, error, refetch } =
    trpc.transaction.getTransaction.useQuery({
      id: parseInt(slug as string),
    });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  // Calculate time left for payment deadline
  useEffect(() => {
    if (!data || data.paymentStatus !== 'PENDING') return;

    const calculateTimeLeft = () => {
      // Assuming 24 hours payment window from createdAt
      const createdAt = new Date(data.createdAt);
      const deadline = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();

      if (now > deadline) {
        return 'Expired';
      }

      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (isLoading) {
    return (
      <main className={`${styles.background} min-h-screen`}>
        <HeaderInvoices />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className={`${styles.background} min-h-screen`}>
        <HeaderInvoices />
        <div className="container mx-auto p-4">
          <Card className={`mt-8 ${styles.card}`}>
            <CardHeader>
              <CardTitle className="text-red-300">
                Error Loading Invoice
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                We couldn&apos;t load the invoice information. Please try again.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => refetch()} className={styles.button}>
                <RefreshCw size={16} className="mr-2" /> Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  // Get payment details based on payment code
  const getPaymentMethod = (paymentCode: string) => {
    if (['bni', 'bri', 'VA', 'I1', 'BR'].includes(paymentCode)) {
      return 'Virtual Account';
    }
    // E-wallet
    if (['OV', 'SA', 'LQ', 'DA'].includes(paymentCode)) {
      return 'E-Wallet';
    }
    // QRIS
    if (paymentCode === 'QR') {
      return 'QRIS';
    }
    // Retail
    if (['FT', 'A1'].includes(paymentCode)) {
      return 'Convenience Store';
    }
    return 'Other';
  };

  const paymentMethod = getPaymentMethod(data.paymentCode);
  const paymentReference = data.paymentReference || '-';
  const paymentStatus = data.paymentStatus;
  const totalAmount = (data.finalAmount || data.originalAmount) ?? 0;
  const isQris = paymentMethod === 'QRIS';
  console.log(data);

  return (
    <main className={`${styles.background} min-h-screen`}>
      <HeaderInvoices />

      <div className="container mx-auto p-4">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8">
          <div>
            <h1 className={`text-2xl font-bold ${styles.heading}`}>
              Invoice #{data.merchantOrderId}
            </h1>
            <p className={styles.mutedText}>
              Created on {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge className={getStatusColor(paymentStatus)}>
              {paymentStatus}
            </Badge>
            {paymentStatus === 'PENDING' && (
              <div className="mt-2 text-right">
                <p className={styles.mutedText}>Time remaining</p>
                <p className="font-mono text-orange-300 font-bold">
                  {timeLeft}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Payment Info */}
          <div className="md:col-span-2">
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardHeader}>
                  Payment Details
                </CardTitle>
                <CardDescription className={styles.cardDescription}>
                  Complete your payment using the details below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method */}
                <div>
                  <h3
                    className={`text-sm font-medium ${styles.mutedText} mb-2`}
                  >
                    Payment Method
                  </h3>
                  <p className={`font-medium ${styles.text}`}>
                    {paymentMethod}
                  </p>
                </div>

                {/* QRIS Image - Display directly if payment method is QRIS */}
                {isQris && data.paymentUrl && (
                  <div className="flex flex-col items-center  p-4 rounded-lg">
                    <div className=" p-4 rounded w-full max-w-xs">
                      <Image
                        width={400}
                        height={100}
                        src={data.paymentUrl}
                        alt="QRIS Payment Code"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-xs text-center text-blue-300 mt-2">
                      Scan this code with your e-wallet app
                    </p>
                  </div>
                )}

                {/* Payment Reference - Show only if not QRIS */}
                {!isQris && (
                  <div>
                    <h3
                      className={`text-sm font-medium ${styles.mutedText} mb-2`}
                    >
                      {paymentMethod === 'Virtual Account'
                        ? 'Virtual Account Number'
                        : paymentMethod === 'Convenience Store'
                        ? 'Payment Code'
                        : 'Reference Number'}
                    </h3>
                    <div className="flex items-center">
                      <p className={`font-mono text-lg ${styles.text}`}>
                        {paymentReference}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(paymentReference, 'Reference number')
                        }
                        className={`ml-2 ${styles.buttonGhost}`}
                      >
                        <CopyIcon size={16} />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                <div>
                  <h3
                    className={`text-sm font-medium ${styles.mutedText} mb-2`}
                  >
                    Total Amount
                  </h3>
                  <p className={`text-2xl font-bold ${styles.text}`}>
                    {FormatPrice(totalAmount)}
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="mt-6">
                  <h3 className={`font-medium mb-3 ${styles.text}`}>
                    Payment Instructions
                  </h3>
                  <div className="bg-[#001c4d] p-4 rounded-lg">
                    <ol
                      className={`list-decimal pl-5 space-y-2 ${styles.text}`}
                    >
                      {paymentMethod === 'Virtual Account' && (
                        <>
                          <li>
                            Log in to your mobile banking app or internet
                            banking
                          </li>
                          <li>Select Transfer/Payment menu</li>
                          <li>Enter the virtual account number shown above</li>
                          <li>Confirm the amount and complete your payment</li>
                        </>
                      )}
                      {paymentMethod === 'QRIS' && (
                        <>
                          <li>Open your preferred e-wallet app</li>
                          <li>Scan the QR code shown above</li>
                          <li>Confirm the amount and complete your payment</li>
                        </>
                      )}
                      {paymentMethod === 'Convenience Store' && (
                        <>
                          <li>
                            Visit your nearest{' '}
                            {data.paymentCode === 'FT'
                              ? 'Alfamart'
                              : 'Indomaret'}
                          </li>
                          <li>Tell the cashier you want to make a payment</li>
                          <li>Show the payment code above</li>
                          <li>
                            Pay the amount as shown on the cashier&apos;s screen
                          </li>
                        </>
                      )}
                      {paymentMethod === 'E-Wallet' && (
                        <>
                          <li>Open your e-wallet app</li>
                          <li>Click on the payment button in your app</li>
                          <li>
                            Follow the instructions in your app to complete
                            payment
                          </li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>

                {/* Payment URL for non-QRIS methods that need redirection */}
                {data.paymentUrl && !isQris && (
                  <div className="mt-4">
                    <Link
                      href={data.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className={`w-full flex items-center justify-center gap-2 ${styles.button}`}
                      >
                        Complete Payment <ExternalLink size={16} />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardHeader}>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className={styles.mutedText}>Order ID</span>
                  <span className={styles.text}>{data.merchantOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.mutedText}>Service</span>
                  <span className={styles.text}>{data.layananId}</span>
                </div>
                <div className="flex justify-between">
                  <span className={styles.mutedText}>WhatsApp Number</span>
                  <span className={styles.text}>{data.noWa}</span>
                </div>
                <Separator className={styles.separator} />
                <div className="flex justify-between">
                  <span className={styles.mutedText}>Subtotal</span>
                  <span className={styles.text}>
                    {FormatPrice(data.originalAmount || 0)}
                  </span>
                </div>
                {data.discountAmount > 0 && (
                  <div className="flex justify-between text-green-300">
                    <span>Discount</span>
                    <span>-{FormatPrice(data.discountAmount)}</span>
                  </div>
                )}
                <Separator className={styles.separator} />
                <div className="flex justify-between font-bold">
                  <span className={styles.text}>Total</span>
                  <span className="text-blue-200">
                    {FormatPrice(data.finalAmount || 0)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className={`w-full flex items-center justify-center gap-2 ${styles.buttonOutline}`}
                >
                  <Download size={16} /> Download Invoice
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

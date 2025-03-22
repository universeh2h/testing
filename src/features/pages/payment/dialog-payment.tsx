/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMidtransPayment } from '@/hooks/use-payment';
import { usePlansStore } from '@/hooks/use-select-plan';
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { FormatPrice } from '@/utils/formatPrice';
import { toast } from 'sonner';
import { CheckNickName } from '@/lib/check-nickname';
import { useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { GAMES_WITH_VALIDATION, GameType } from '@/data/check-code';

export function DialogPayment({ amount }: { amount: number }) {
  const {
    selectPlans,
    selectPayment,
    noWa,
    voucher,
    userID,
    serverID,
    categories,
    setCategories,
    setSelectPayment,
    setSelectPlans,
    setServerId,
    setUserId,
    setVoucher,
  } = usePlansStore();
  const payment = useMidtransPayment();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nicknameData, setNicknameData] = useState<string | null>(null);
  const { name } = useParams();
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requiresValidation, setRequiresValidation] = useState(false);

  useEffect(() => {
    const gameType = name as GameType;
    const needsValidation = GAMES_WITH_VALIDATION.includes(gameType);
    setRequiresValidation(needsValidation);
  }, [name]);

  useEffect(() => {
    async function checkNickname() {
      if (!isDialogOpen || !userID || !requiresValidation) {
        return;
      }

      // For games that need server ID but it's not provided
      if (requiresValidation && name === 'mobile-legend' && !serverID) {
        setError('Server ID is required for this game');
        return;
      }

      try {
        setIsCheckingNickname(true);
        setNicknameData(null);
        setError(null);

        const nicknameResult = await CheckNickName({
          type: name as GameType,
          userId: userID,
          serverId: serverID as string,
        });
        console.log(nicknameResult)
        if (nicknameResult.success) {
          setNicknameData(nicknameResult.name || 'account ditemukan');
        } else {
          setError(`Pengguna Di temukan`);
        }
      } catch (err) {
        setError('Failed to check nickname. Please try again.');
      } finally {
        setIsCheckingNickname(false);
      }
    }

    checkNickname();
  }, [isDialogOpen, userID, serverID, name, requiresValidation]);

  const handlePayment = async () => {
    if (!noWa || !selectPayment?.code || !selectPlans) {
      setError('Missing required payment information');
      return;
    }

    if (requiresValidation && !nicknameData && !isCheckingNickname) {
      setError('Please wait for account verification or try again');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await payment.initiatePayment({
        noWa: noWa,
        paymentCode: selectPayment.code,
        layanan: selectPlans.layanan,
        accountId: userID as string,
        serverId: serverID as string,
        voucherCode: voucher,
        game: name as string,
        typeTransaksi: selectPayment.type,
        nickname: nicknameData ?? 'not-found',
      });

      if (response.success) {
        if (response.paymentUrl) {
          setPaymentUrl(response.paymentUrl);
          console.log(response.paymentUrl)
          window.open(response.paymentUrl, '_blank');
        }

        setSelectPayment(null);
        setCategories(null);
        setSelectPlans(null);
        setVoucher('');
        setServerId(null);
        setUserId(null);

        toast.success('Payment initiated successfully!');
      }
    } catch (err) {
      toast.error(`Payment error: ${err}`);
      setError('Terjadi kesalahan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if payment should be allowed to proceed
  const isPaymentDisabled =
    isLoading ||
    !noWa ||
    (requiresValidation && isCheckingNickname) ||
    (requiresValidation && !nicknameData && !error);

  return (
    <Dialog onOpenChange={(open) => setIsDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-6 rounded-md transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
          Continue To Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-[#001435] to-[#00102b] border-2 border-blue-800/50 text-blue-100 p-0 max-w-md rounded-xl shadow-2xl">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 rounded-full p-3 shadow-lg border-4 border-[#001435]">
          <CreditCard className="h-6 w-6 text-white" />
        </div>

        <DialogHeader className="pt-8 px-6 text-center">
          <DialogTitle className="text-xl font-bold text-blue-100">
            Complete Your Payment
          </DialogTitle>
          <DialogDescription className="text-blue-300 mt-1">
       
          </DialogDescription>
        </DialogHeader>

        {/* Game info section */}
        {categories && (
          <div className="px-6 py-3">
            <div className="flex items-center space-x-3 mb-2">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-blue-900/50">
                <Image
                  src={
                    categories.thumbnail ||
                    '/placeholder.svg?height=48&width=48'
                  }
                  alt={categories.nama}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-blue-100">{categories.nama}</h3>
                <p className="text-xs text-blue-300">
                  {selectPlans?.layanan || 'Product'}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-blue-800/50" />

        {/* Payment details */}
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-blue-300 mb-3">
            Payment Details
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-blue-300">Account</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-blue-100">
                  {requiresValidation ? (
                    isCheckingNickname ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Checking...
                      </span>
                    ) : nicknameData ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3 text-green-400" />
                        {nicknameData}
                      </span>
                    ) : (
                      <span className="text-red-300">Not verified</span>
                    )
                  ) : (
                    <span className="text-blue-100">
                      No verification needed
                    </span>
                  )}
                </span>
                <p className="text-xs text-blue-400">
                  {userID}
                  {serverID ? ` (${serverID})` : ''}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-blue-300">Payment</span>
              </div>
              <span className="font-medium text-blue-100">
                {selectPayment?.name || 'Not selected'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-blue-300">WhatsApp</span>
              </div>
              <span className="font-medium text-blue-100">
                {noWa || 'Not provided'}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-blue-800/50" />

        {/* Total amount */}
        <div className="px-6 py-4 bg-blue-900/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-300">
              Total Amount
            </span>
            <span className="text-xl font-bold text-blue-100">
              {amount ? FormatPrice(amount) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 p-3 bg-red-900/20 border border-red-800 rounded-md text-red-300 text-sm flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {paymentUrl && (
          <div className="mx-6 p-3 bg-green-900/20 border border-green-800 rounded-md text-green-300 text-sm flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              Payment initiated successfully!
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-400 hover:text-blue-300 underline"
              >
                Click here if you&apos;re not redirected automatically
              </a>
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="px-6 py-2 flex items-center justify-center text-xs text-blue-400">
          <ShieldCheck className="h-3 w-3 mr-1" />
          <span>Secure payment processing</span>
        </div>

        {/* Action button */}
        <div className="p-6 pt-3">
          <Button
            onClick={handlePayment}
            disabled={isPaymentDisabled}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-6 rounded-md transition-all shadow-lg disabled:opacity-70 h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

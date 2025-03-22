'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Clock,
  ArrowUpRight,
  Plus,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, FormatPrice } from '@/utils/formatPrice';
import { trpc } from '@/utils/trpc';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SelectPayment } from './components/selectPayment';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Deposit {
  jumlah: number;
  createdAt: string | null
  id: number;
  metode: string;
  status: string;
  updatedAt: string | null
  username: string;
}

export function UserTopUp() {
  const [amount, setAmount] = useState<string>('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setIsLoading] = useState(false);
  const { push } = useRouter();


  // Fetch deposits data
  const { data: depositsData, isLoading: depositsLoading } =
    trpc.deposits.getByUsername.useQuery();


    console.log(depositsData?.data)
  const deposits = depositsData?.data?.history || [];
  const user =   depositsData?.data?.user 

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  // Handle top-up initiation
  const handleTopUp = () => {
    if (amount && parseInt(amount) > 0) {
      setShowPaymentMethods(true);
    }
  };

  // Handle payment method selection
  const handleMethodSelect = (methodId: number, code: string) => {
    setSelectedMethodId(methodId);
    setCode(code);
  };

  // Handle back to amount selection
  const handleBackToAmount = () => {
    setShowPaymentMethods(false);
    setSelectedMethodId(null);
  };

  // Handle the actual top-up process
  const handleDeposit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/deposit', {
        code,
        amount: parseInt(amount),
      });
      toast.success('Deposit berhasil');
      push(response.data.paymentUrl);
    } catch (error) {
      console.error(error)
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined top-up amounts
  const predefinedAmounts = [10000, 20000, 50000, 100000, 200000, 500000];

  // Loading overlay
  if (loading || depositsLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Sedang Memproses...</p>
        </div>
      </div>
    );
  }



  return (
    <main className="container mx-auto px-4 py-10 min-h-screen max-w-7xl relative">
      {/* Saldo Section */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Saldo Anda
          </CardTitle>
          <CardDescription>Saldo tersedia untuk digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{FormatPrice(user?.balance || 0)}</p>
        </CardContent>
      </Card>

      {/* Top-Up and History Tabs */}
      {showPaymentMethods ? (
        <PaymentMethodSection
          onBack={handleBackToAmount}
          onSelect={handleMethodSelect}
          onSubmit={handleDeposit}
          selectedMethodId={selectedMethodId}
          amount={parseInt(amount)}
          loading={loading}
        />
      ) : (
        <Tabs defaultValue="topup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topup">Top Up</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
          </TabsList>

          {/* Top-Up Tab */}
          <TabsContent value="topup" className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Pilih Nominal Top Up</h3>

            {/* Predefined Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {predefinedAmounts.map((preAmount) => (
                <Button
                  key={preAmount}
                  variant={amount === preAmount.toString() ? 'default' : 'outline'}
                  className="h-16"
                  onClick={() => setAmount(preAmount.toString())}
                >
                  {FormatPrice(preAmount)}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <CustomAmountInput
              amount={amount}
              onChange={handleAmountChange}
              onSubmit={handleTopUp}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            <HistorySection deposits={deposits} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

// Payment Method Section
function PaymentMethodSection({
  onBack,
  onSelect,
  onSubmit,
  selectedMethodId,
  amount,
  loading,
}: {
  onBack: () => void;
  onSelect: (methodId: number, code: string) => void;
  onSubmit: () => void;
  selectedMethodId: number | null;
  amount: number;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="mr-2 p-2 h-8 w-8"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">Pilih Metode Pembayaran</h2>
      </div>
      <TooltipProvider>
        <SelectPayment amount={amount} onMethodSelect={onSelect} />
      </TooltipProvider>
      {selectedMethodId && (
        <div className="mt-4">
          <Button
            className="w-full"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Lanjutkan Pembayaran'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Custom Amount Input Section
function CustomAmountInput({
  amount,
  onChange,
  onSubmit,
}: {
  amount: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-2 mt-4">
      <Label htmlFor="custom-amount">Nominal Lainnya</Label>
      <div className="flex gap-2">
        <Input
          id="custom-amount"
          type="text"
          placeholder="Masukkan nominal"
          value={amount}
          onChange={onChange}
        />
        <Button onClick={onSubmit} disabled={!amount || parseInt(amount) <= 0}>
          <Plus className="mr-2 h-4 w-4" /> Top Up
        </Button>
      </div>
    </div>
  );
}

// History Section
function HistorySection({ deposits }: { deposits: Deposit[] }) {
  if (!deposits || deposits.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Belum ada riwayat top up</p>
      </div>
    );
  }


  console.log(deposits)

  return (
    <div className="space-y-3">
      {deposits.map((deposit) => (
        <Card key={deposit.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{deposit.metode}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(deposit.createdAt as string)}
                </p>
              </div>
            </div>
            <p
              className={`font-semibold ${
                deposit.status === 'PENDING' ? 'text-yellow-500' : 'text-green-500'
              }`}
            >
              {deposit.status === 'SUCCESS'
                ? `+${FormatPrice(deposit.jumlah)}`
                : `${FormatPrice(deposit.jumlah)}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
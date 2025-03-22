import { trpc } from "@/utils/trpc";
import { Coins, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormatPrice } from "@/utils/formatPrice";
import { Method } from "@/hooks/use-select-plan";

interface PaymentMethodUsingDepositProps {
  amount: number;
  selectedMethod: Method | null;
  onSelect: (method: Method) => void;
}

export function PaymentMethodUsingDeposit({
  amount,
  selectedMethod,
  onSelect
}: PaymentMethodUsingDepositProps) {
  
  const { data: userData, isLoading } = trpc.member.findMe.useQuery();
  console.log(userData)

  if (isLoading) {
    return (
      <div className="border border-blue-800 rounded-lg p-4 bg-blue-950/40">
        <div className="flex items-center gap-2 text-blue-300">
          <Coins className="h-5 w-5" />
          <span>Memuat data saldo...</span>
        </div>
      </div>
    );
  }
  
  const balance =  userData?.balance ?? 0 as number  
  const isDisabled = amount > balance;
  
  const handleSelectCoin = () => {
    if (!isDisabled) {
      onSelect({
        code : "SALDO",
        name : "SALDO",
        price : amount,
        type : "SALDO"
      });
    }
  };
  
  const isSelected = selectedMethod?.code === "SALDO";
  
  return (
    <div
      className={cn(
        'cursor-pointer border border-blue-800 hover:border-blue-400 rounded-lg w-full overflow-hidden relative bg-blue-950/20 transition-all duration-200',
        isSelected && 'border-blue-400 bg-blue-900/30',
        isDisabled && 'opacity-60 pointer-events-none'
      )}
      onClick={handleSelectCoin}
    >
      <div className="h-full flex flex-row items-center p-4">
        <div className="flex-shrink-0 flex items-center justify-center mr-3">
          <Coins className="h-10 w-10 text-yellow-400" />
        </div>
        <div className="flex-grow space-y-1">
          <p className="text-sm font-medium text-blue-100">
            Bayar dengan Koin
          </p>
          <p className="text-xs text-blue-300">
            Saldo Anda: {FormatPrice(balance)}
          </p>
          
          {amount > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-blue-200">
                {isDisabled ? 'Saldo tidak mencukupi' : `Sisa setelah pembayaran: ${FormatPrice(balance - amount)}`}
              </span>
            </div>
          )}
        </div>
        
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="h-5 w-5 text-blue-400" />
          </div>
        )}
        
        {isDisabled && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center text-xs text-red-400 gap-1">
              <AlertCircle className="h-3 w-3" />
              Saldo Tidak Cukup
            </span>
          </div>
        )}
      </div>
    </div>
  );
}



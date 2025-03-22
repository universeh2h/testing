import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CreditCard, CheckCircle2, LockIcon, Coins, ChevronDown, ChevronUp, Store, QrCode } from "lucide-react";
import Image from "next/image";
import { PaymentMethodUsingDeposit } from "./payment-deposit";
import { FormatPrice } from "@/utils/formatPrice";
import { Method } from "@/hooks/use-select-plan";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodsProps {
  amount: number;
  paymentTypes: string[];
  groupedMethods: Record<string, PaymentMethod[]>;
  onSelectMethod: (method: Method) => void;
  selectedMethod: Method | null;
}

export function PaymentMethods({
  amount,
  paymentTypes,
  groupedMethods,
  onSelectMethod,
  selectedMethod
}: PaymentMethodsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const displayAmount = amount > 0 ? amount : null;
  
  // Mengelompokkan metode pembayaran ke dalam kategori
  const paymentCategories = {
    "BANK_TRANSFER": ["bank_transfer"],
    "E_WALLET": ["qris", "ovo", "shopeepay"],
    "CONVENIENCE_STORE": ["cstore"],
    "KOIN": ["balance"]
  };
  
  // Mendapatkan kategori berdasarkan kode metode pembayaran
  const getMethodCategory = (type: string): string => {
    for (const [category, types] of Object.entries(paymentCategories)) {
      if (types.includes(type)) {
        return category;
      }
    }
    return "LAINNYA";
  };
  
  // Icon untuk setiap kategori
  const categoryIcons: Record<string, React.ReactNode> = {
    "BANK_TRANSFER": <CreditCard className="h-5 w-5 text-blue-300" />,
    "E_WALLET": <QrCode className="h-5 w-5 text-green-300" />,
    "CONVENIENCE_STORE": <Store className="h-5 w-5 text-orange-300" />,
    "KOIN": <Coins className="h-5 w-5 text-yellow-400" />,
    "LAINNYA": <CreditCard className="h-5 w-5 text-blue-300" />
  };
  
  // Label untuk setiap kategori
  const categoryLabels: Record<string, string> = {
    "BANK_TRANSFER": "Transfer Bank",
    "E_WALLET": "E-Wallet",
    "CONVENIENCE_STORE": "Convenience Store",
    "KOIN": "Koin / Saldo",
    "LAINNYA": "Metode Lainnya"
  };
  
  // Mengelompokkan metode berdasarkan kategori
  const getCategoryMethods = (category: string): PaymentMethod[] => {
    const types = paymentCategories[category as keyof typeof paymentCategories] || [];
    return types.flatMap(type => groupedMethods[type] || []);
  };

  // Daftar kategori yang memiliki metode pembayaran
  const availableCategories = Object.keys(paymentCategories).filter(category => 
    getCategoryMethods(category).length > 0
  );
  
  const isAmountValid = (method: PaymentMethod, amount?: number): boolean => {
    if (!amount) return false;
    
    const minValue = method?.min ?? 0;
    const maxValue = method?.max ?? Infinity;
    
    return amount >= minValue && amount <= maxValue;
  };

  const toggleSection = (category: string) => {
    setOpenSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSelectMethod = (method: Method) => {
    onSelectMethod(method);
  };

  // Initialize first section as open on mount
  useEffect(() => {
    if (amount && availableCategories.length > 0 && Object.keys(openSections).length === 0) {
      const initialState: Record<string, boolean> = {};
      availableCategories.forEach((category, index) => {
        initialState[category] = index === 0; // Open first section by default
      });
      setOpenSections(initialState);
    }
  }, [amount, availableCategories, openSections]);

  return (
    <div className="space-y-4">
      {/* Opsi pembayaran dengan Koin */}
      <div className={cn(!amount && 'opacity-60 pointer-events-none')}>
        <div className="border border-blue-800 rounded-lg mb-4 overflow-hidden">
          <div 
            className="px-4 py-4 bg-blue-900/50 text-blue-100 cursor-pointer hover:bg-blue-900/70 transition-all duration-200"
            onClick={() => toggleSection('KOIN')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">Bayar dengan Koin</span>
                {displayAmount && <span>{FormatPrice(displayAmount)}</span>}
                {!amount && (
                  <span className="ml-2 text-xs text-red-300 flex items-center gap-1">
                    <LockIcon className="h-3 w-3" />
                    Pilih Paket Dahulu
                  </span>
                )}
              </div>
              {openSections['KOIN'] ? (
                <ChevronUp className="h-5 w-5 text-blue-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-300" />
              )}
            </div>
          </div>
          
          {openSections['KOIN'] && (
            <div className="px-4 pt-3 pb-5 bg-blue-950/40">
              <PaymentMethodUsingDeposit
                amount={amount}
                selectedMethod={selectedMethod}
                onSelect={handleSelectMethod}
              />
            </div>
          )}
        </div>
      </div>

      {/* Metode pembayaran lainnya berdasarkan kategori */}
      {availableCategories.filter(cat => cat !== 'KOIN').map((category) => {
        const methodsInCategory = getCategoryMethods(category);
        
        if (methodsInCategory.length === 0) return null;
        
        return (
          <div
            key={category}
            className={cn(
              "border border-blue-800 rounded-lg mb-4 overflow-hidden",
              !amount && 'opacity-60 pointer-events-none'
            )}
          >
            <div 
              className="px-4 py-4 bg-blue-900/50 text-blue-100 cursor-pointer hover:bg-blue-900/70 transition-all duration-200"
              onClick={() => amount && toggleSection(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {categoryIcons[category]}
                  <span className="font-medium">
                    {categoryLabels[category]}
                  </span>
                  {displayAmount && <span>{FormatPrice(displayAmount)}</span>}
                  {!amount && (
                    <span className="ml-2 text-xs text-red-300 flex items-center gap-1">
                      <LockIcon className="h-3 w-3" />
                      Pilih Paket Dahulu
                    </span>
                  )}
                </div>
                {openSections[category] ? (
                  <ChevronUp className="h-5 w-5 text-blue-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-300" />
                )}
              </div>
            </div>
            
            {openSections[category] && (
              <div className="px-4 pt-3 pb-5 bg-blue-950/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {methodsInCategory.map((method) => {
                    const isValid = isAmountValid(method, amount);
                    
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          'cursor-pointer border border-blue-800 hover:border-blue-400 rounded-lg w-full h-24 overflow-hidden relative bg-blue-950/20 transition-all duration-200',
                          selectedMethod?.code === method.code &&
                            'border-blue-400 bg-blue-900/30',
                          !isValid && 'opacity-60 pointer-events-none'
                        )}
                        onClick={() => isValid && handleSelectMethod({
                          code: method.code as string,
                          name: method.name,
                          price: amount || 0,
                          type: method.type
                        })}
                      >
                        <div className="h-full flex flex-row items-center p-3">
                          <div className="flex-shrink-0 flex items-center justify-center mr-3">
                            <Image
                              width={300}
                              height={300}
                              src={method.images}
                              alt={method.name}
                              className="size-12 object-contain"
                            />
                          </div>
                          <div className="flex-grow space-y-1">
                            <p className="text-sm font-medium text-blue-100">
                              {method.name}
                            </p>
                            {method.keterangan && (
                              <p className="text-xs text-blue-300">
                                {method.keterangan}
                              </p>
                            )}
                          </div>
                          {selectedMethod?.code === method.code && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-400" />
                            </div>
                          )}
                          {!isValid && (
                            <div className="absolute top-2 right-2">
                              <span className="text-xs text-red-400">
                                Tidak Tersedia
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
'use client';
import { useState } from 'react';
import { trpc } from "@/utils/trpc";
import { Card, CardContent } from "@/components/ui/card";
import {  Plus } from "lucide-react";
import { FormatPrice } from "@/utils/formatPrice";
;
interface SelectAmountProps {
    amount: number;
    onMethodSelect: (methodId: number,code : string) => void;
  }
  
  export function SelectPayment({ amount, onMethodSelect }: SelectAmountProps) {
    const { data: methods, isLoading } = trpc.methods.getMethods.useQuery();
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  
    const handleSelectMethod = (methodId: number,code : string) => {
      setSelectedMethod(methodId);
      onMethodSelect(methodId,code);
    };
  
    const isMethodAvailable = (method: any) => {
      // Check if amount is within the method's limits
      const isAboveMin = !method.min || amount >= method.min;
      const isBelowMax = !method.max || amount <= method.max;
      return isAboveMin && isBelowMax;
    };
  
    const calculateTotalAmount = (method: any) => {
      let total = amount;
      if (method.taxAdmin) {
        if (method.typeTax === 'PERCENTAGE') {
          total += (amount * method.taxAdmin / 100);
        } else {
          total += method.taxAdmin;
        }
      }
      return total;
    };
  
    return (
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Pilih Metode Pembayaran</h2>
          <span className="text-sm text-muted-foreground">Jumlah: {FormatPrice(amount)}</span>
        </div>
  
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3   gap-3">
            {methods?.data?.map((method) => {
              const isAvailable = isMethodAvailable(method);
              const totalAmount = calculateTotalAmount(method);
              
              return (
                <Card 
                  key={method.id}
                  className={`border transition-all hover:shadow-md ${!isAvailable ? 'opacity-60' : ''} ${selectedMethod === method.id ? 'border-primary border-2' : ''}`}
                >
                  <CardContent className="p-4">
                    <button
                      onClick={() => isAvailable && handleSelectMethod(method.id,method.code)}
                      disabled={!isAvailable}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={method.images} 
                            alt={method.name} 
                            className="w-full h-full object-contain p-1" 
                          />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm">{method.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                              <div className="text-xs flex items-center text-muted-foreground">
                                <span className=" text-primary">
                                  Total: {FormatPrice(totalAmount)}
                                </span>
                              </div>                            
                          </div>
                        </div>
                      </div>
                    </button>
  
                    {!isAvailable && (
                      <div className="mt-2 text-xs text-red-500 flex items-center">
                        {amount < (method.min || 0) 
                          ? `Minimal pembayaran ${FormatPrice(method.min || 0)}` 
                          : `Maksimal pembayaran ${FormatPrice(method.max || 0)}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
  
        {methods?.data?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada metode pembayaran yang tersedia</p>
          </div>
        )}
      </section>
    );
  }
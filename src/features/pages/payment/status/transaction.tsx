import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Copy, CheckCircle, ArrowLeft, Printer } from "lucide-react";
import { formatDate } from "@/utils/formatPrice";
import { getStatusConfig, useLogicTransaksi } from "./utils";
import { InvoicePrint } from "@/data/export/print-invoices";
import { cn } from "@/lib/utils";

interface TransactionDetailsProps {
  data: Transaksi;
  onBack?: () => void;
  onViewDetails?: () => void;
}

export function TransactionDetails({ data, onBack}: TransactionDetailsProps) {
  const { copy, url, copied, timeLeft, paymentType } = useLogicTransaksi({ data });
  const statusConfig = getStatusConfig(data.status);
  const paymentStatusConfig = data.pembayaran ? getStatusConfig(data.pembayaran.status) : statusConfig;
  const isPending = data.pembayaran?.status === "PENDING" || data.pembayaran?.status === "PROCESS";

  // Parse timeLeft into hours, minutes, seconds for better display
  const timeLeftParts = timeLeft ? timeLeft.split(":").map((part) => part.trim()) : ["00", "00", "00"];
  const [hours, minutes, seconds] = timeLeftParts.length === 3 ? timeLeftParts : ["00", ...timeLeftParts];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kartu Informasi Pembelian */}
        <Card className="shadow-md border-0 overflow-hidden rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Informasi Pembelian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Detail Layanan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-md font-medium text-muted-foreground mb-3">Detail Layanan</h3>
              <div className="space-y-3">
                <DetailItem label="Pembelian " value={data.layanan} />
                <DetailItem label="Tipe Transaksi" value={data.tipeTransaksi} valueClassName="text-md"/>
                <DetailItem
                  label="Harga"
                  value={`Rp ${data.harga.toLocaleString("id-ID")}`}
                  valueClassName="font-semibold text-primary"
                />
              </div>
            </motion.div>

            {/* Informasi Pengguna */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Detail Pengguna</h3>
              <div className="space-y-3">
                <DetailItem label="Username" value={data.username || "-"} valueClassName="text-lg" />
                <DetailItem label="Nickname" value={data.nickname || "-"} />
                {data.userId && <DetailItem label="User Id" value={data.userId} />}
                {data.zone && <DetailItem label="Zone" value={data.zone} />}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Kartu Informasi Pembayaran */}
        {data.pembayaran && (
          <Card className="shadow-md border-0 overflow-hidden rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Informasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer untuk pembayaran pending */}
              {isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                <div className={`p-4 rounded-lg bg-[hsl(217,100%,16%)] border border-[hsl(217,100%,20%)]`}>
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    {/* Bagian Kiri: Label "Batas Waktu Pembayaran" */}
    <div className="flex items-center">
      <Clock className="h-5 w-5 mr-2 text-white" />
      <span className="font-medium text-white">Batas Waktu Pembayaran:</span>
    </div>

    {/* Bagian Kanan: Timer */}
    <div className="flex items-center gap-2">
      {/* Jam */}
      <div className="flex flex-col items-center">
        <div className="">
          <span className="text-2xl font-bold text-white">{hours}</span>
        </div>
        <span className="text-xs mt-1 text-gray-300">Jam</span>
      </div>

      {/* Separator ":" */}
      <span className="text-xl font-bold text-white mt-[-0.5rem]">:</span>

      {/* Menit */}
      <div className="flex flex-col items-center">
        <div className="">
          <span className="text-2xl font-bold text-white">{minutes}</span>
        </div>
        <span className="text-xs mt-1 text-gray-300">Menit</span>
      </div>

      {/* Separator ":" */}
      <span className="text-xl font-bold text-white mt-[-0.5rem]">:</span>

      {/* Detik */}
      <div className="flex flex-col items-center">
        <div className="">
          <span className="text-2xl font-bold text-white">{seconds}</span>
        </div>
        <span className="text-xs mt-1 text-gray-300">Detik</span>
      </div>
    </div>
  </div>
</div>
                </motion.div>
              )}

              {/* Detail Pembayaran */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Detail Pembayaran</h3>
                <div className="space-y-3">
                  <DetailItem label="Metode" value={data.pembayaran.metode} />
                  {/* Virtual Account */}
                  {paymentType === "VA" && data.pembayaran.noPembayaran && (
                    <div className="mt-2 mb-3">
                      <div className="text-sm text-muted-foreground mb-1">No. Virtual Account:</div>
                      <div className="flex items-center justify-between bg-blue-600 p-2 rounded-md">
                        <span className="font-mono text-base font-medium">{data.pembayaran.noPembayaran}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copy(data.pembayaran?.noPembayaran || "", "vaNumber")}
                                className="h-8 ml-2"
                              >
                                {copied.id === "vaNumber" && copied.value ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                    Copied
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{copied.id === "vaNumber" && copied.value ? "Copied!" : "Copy to clipboard"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )}
                  {/* Payment URL */}
                  {paymentType === "URL" && data.pembayaran.reference && (
                    <div className="mt-2 mb-3">
                      <div className="text-sm text-muted-foreground mb-1">Link Pembayaran:</div>
                      <Button
                        variant="outline"
                        onClick={url}
                        className="w-full justify-center text-sm py-2 h-10 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Buka Link Pembayaran
                      </Button>
                    </div>
                  )}
                  <DetailItem  label="Status"  value={<Badge status={data.status}/>}/>
                  <DetailItem label="Waktu" value={formatDate(data.pembayaran.createdAt as string)} />
                  <DetailItem label="No. Pembeli" value={`${data.pembayaran.noPembeli}`} valueClassName="" />
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6  dark:bg-slate-900">
                <InvoicePrint data={data}/>
          </CardFooter>
          </Card>
        )}
        
      </div>
    </div>
  );
}

// Komponen DetailItem
export function DetailItem({ label, value, valueClassName = "" }  : {label : string,value : string | ReactNode,valueClassName? : string}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-md text-muted-foreground">{label}</span>
      <span className={cn("text-md", valueClassName)}>{value}</span>    </div>
  );
}


type BadgeProps = {
  status: string;
};

export function Badge({ status }: BadgeProps) {
  const { color, textColor, bgColor, borderColor } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} border ${borderColor}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${color}`}></span>
      {status}
    </span>
  );
}
import { Check, CreditCard, Loader2, Package } from "lucide-react";

export type Product = {
  product_name: string;
  category: string;
  brand: string;
  type: string;
  seller_name: string;
  price: number;
  buyer_sku_code: string;
  buyer_product_status: boolean;
  seller_product_status: boolean;
  unlimited_stock: boolean;
  stock: number;
  multi: boolean;
  start_cut_off: string;
  end_cut_off: string;
  desc: string;
};


export const stepsTransaction = [
  {
    id: 'PENDING',
    label: 'Transaksi telah Dibuat',
    description: 'Transaksi telah berhasil dibuat',
    icon: Check,
  },
  {
    id: 'PAID',
    label: 'Pembayaran',
    description: 'Silahkan melakukan pembayaran',
    icon: CreditCard,
  },
  {
    id: 'PROCESS',
    label: 'Sedang Di Proses',
    description: 'Pembelian sedang dalam proses',
    icon: Loader2,
  },
  {
    id: 'SUCCESS',
    label: 'Transaksi Selesai',
    description: 'Transaksi telah Berhasil Dilakukan',
    icon: Package,
  },
  {
    id: 'FAILED',
    label: 'Transaksi Gagal',
    description: 'Transaksi Gagal Dilakukan',
    icon: Package,
  },
];
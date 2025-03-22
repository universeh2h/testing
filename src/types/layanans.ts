import { z } from 'zod';

export type Layanan = {
  id: number;
  kategoriId: number; // Mapped from "kategori_id"
  subCategoryId: number; // Mapped from "sub_category_id"
  layanan: string;
  providerId: string; // Mapped from "provider_id"
  harga: number;
  hargaReseller: number; // Mapped from "harga_reseller"
  hargaPlatinum: number; // Mapped from "harga_platinum"
  hargaGold: number; // Mapped from "harga_gold"
  hargaFlashSale?: number | null; // Optional, default 0, mapped from "harga_flash_sale"
  profit: number;
  profitReseller: number; // Mapped from "profit_reseller"
  profitPlatinum: number; // Mapped from "profit_platinum"
  profitGold: number; // Mapped from "profit_gold"
  isFlashSale: boolean; // Default false, mapped from "is_flash_sale"
  judulFlashSale?: string | null; // Optional, mapped from "judul_flash_sale"
  bannerFlashSale?: string | null; // Optional, mapped from "banner_flash_sale"
  expiredFlashSale?: string | null; // Optional, mapped from "expired_flash_sale"
  catatan: string;
  status: boolean;
  provider: string;
  productLogo?: string | null; // Optional, mapped from "product_logo"
  createdAt?: string | null; // Optional, default now(), mapped from "created_at"
  updatedAt?: string | null; // Optional, updated at, mapped from "updated_at"
};

export interface LayananWithCategoryAndSub extends Layanan {
  category: {
    id: number;
    nama : string
  };
  subCategory: {
    id: number;
    name: string;
  };
}


export const layananFormSchema = z.object({
  id: z.number(),
  layanan: z.string().min(1, 'Nama layanan wajib diisi'),
  kategoriId: z.number().int().positive('Kategori wajib dipilih'), // Corrected to number
  subCategoryId: z.number().int().positive('Sub kategori wajib dipilih'),
  providerId: z.string().min(1, 'Provider wajib dipilih'),
  harga: z.number().positive('Harga harus lebih dari 0'),
  hargaReseller: z.number().positive('Harga reseller harus lebih dari 0'),
  hargaPlatinum: z.number().positive('Harga platinum harus lebih dari 0'),
  hargaGold: z.number().positive('Harga gold harus lebih dari 0'),
  hargaFlashSale: z.number().nullable().optional(), // Corrected to optional
  profit: z.number().min(0, 'Profit tidak boleh negatif'),
  profitReseller: z.number().min(0, 'Profit reseller tidak boleh negatif'),
  profitPlatinum: z.number().min(0, 'Profit platinum tidak boleh negatif'),
  profitGold: z.number().min(0, 'Profit gold tidak boleh negatif'),
  isFlashSale: z.boolean().default(false),
  judulFlashSale: z.string().nullable().optional(),
  bannerFlashSale: z.string().nullable().optional(),
  expiredFlashSale: z.string().nullable().optional(),
  catatan: z.string().default(''),
  status: z.boolean().default(true),
  provider: z.string().min(1, 'Provider wajib diisi'),
  productLogo: z.string().nullable().optional(),
});

export interface Voucher {
  code: string;
  createdAt: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  id: number;
  isActive: boolean;
  isForAllCategories: boolean;
  maxDiscount: number | null;
  minPurchase: number | null;
  startDate: string;
  updatedAt: string;
  usageCount: number;
  usageLimit: number | null;
}

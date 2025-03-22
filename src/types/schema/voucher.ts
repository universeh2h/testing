import { z } from 'zod';

export const voucherSchema = z.object({
  id: z.number().int().positive().optional(),
  code: z
    .string()
    .min(1, 'Voucher code is required')
    .max(50, 'Voucher code must be 50 characters or less'),
  discountType: z.string(),
  discountValue: z.number().positive('Discount value must be greater than 0'),
  maxDiscount: z
    .number()
    .positive('Maximum discount must be greater than 0')
    .optional()
    .nullable(),
  minPurchase: z
    .number()
    .positive('Minimum purchase must be greater than 0')
    .optional()
    .nullable(),
  usageLimit: z
    .number()
    .int()
    .positive('Usage limit must be a positive integer')
    .optional()
    .nullable(),
  usageCount: z
    .number()
    .int()
    .nonnegative('Usage count must be a non-negative integer')
    .optional()
    .default(0),
  isForAllCategories: z.boolean().default(false),
  isActive: z.boolean().default(true),
  startDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  expiryDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema with additional validation rules
export const voucherValidationSchema = voucherSchema
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    {
      message: 'Percentage discount cannot exceed 100%',
      path: ['discountValue'],
    }
  )
  .refine(
    (data) => {
      if (
        data.maxDiscount !== null &&
        data.maxDiscount !== undefined &&
        data.discountType === 'FIXED' &&
        data.maxDiscount > data.discountValue
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Maximum discount cannot be greater than the fixed discount value',
      path: ['maxDiscount'],
    }
  )
  .refine(
    (data) => {
      if (
        data.startDate &&
        data.expiryDate &&
        data.startDate >= data.expiryDate
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Expiry date must be after start date',
      path: ['expiryDate'],
    }
  );

// Schema for creating a new voucher
export const createVoucherSchema = voucherSchema
  .omit({ id: true, createdAt: true, updatedAt: true, usageCount: true })
  .extend({
    categoryIds: z.array(z.number().int().positive()).optional(),
  });

// Schema for updating an existing voucher
export const updateVoucherSchema = voucherSchema
  .partial()
  .extend({
    categoryIds: z.array(z.number().int().positive()).optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// Schema for filtering vouchers
export const voucherFilterSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  minDiscountValue: z.number().optional(),
  maxDiscountValue: z.number().optional(),
  isActive: z.boolean().optional(),
  isForAllCategories: z.boolean().optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  expiryDateFrom: z.string().optional(),
  expiryDateTo: z.date().optional(),
  categoryId: z.number().int().positive().optional(),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().optional().default(10),
  sortBy: z
    .enum([
      'id',
      'code',
      'discountValue',
      'startDate',
      'expiryDate',
      'createdAt',
      'updatedAt',
    ])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Type definitions based on Zod schemas
export type Voucher = z.infer<typeof voucherSchema>;
export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherInput = z.infer<typeof updateVoucherSchema>;
export type VoucherFilter = z.infer<typeof voucherFilterSchema>;



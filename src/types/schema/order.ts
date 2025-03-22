import { z } from 'zod';

export const orderSchema = z.object({
  merchantOrderId: z.string(),
  userId: z.number().nullable().optional(),
  layananId: z.number(),
  categoryId: z.number(),
  originalAmount: z.number(),
  discountAmount: z.number().default(0),
  finalAmount: z.number(),
  voucherId: z.number().nullable().optional(),
  transactionType: z.string(),
  paymentStatus: z.string(),
  paymentCode: z.string(),
  paymentReference: z.string().nullable().optional(),
  paymentUrl: z.string().nullable().optional(),
  noWa: z.string(),
  statusMessage: z.string().nullable().optional(),
});

export type OrderSchemasValue = z.infer<typeof orderSchema>;

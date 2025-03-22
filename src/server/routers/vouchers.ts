import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { Prisma, Voucher } from '@prisma/client';

// Type definitions for clarity
interface VoucherInput {
  code: string;
  categoryId: string;
  amount: number;
}

interface VoucherResult {
  success: boolean;
  voucherId: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

interface DiscountResult {
  discountAmount: number;
  finalAmount: number;
}

/**
 * Validates a voucher against various criteria
 * @param prisma - Prisma client instance
 * @param input - Voucher validation input
 * @returns The voucher object if valid
 * @throws TRPCError if validation fails
 */
export async function validateVoucher(
  prisma: Prisma.TransactionClient,
  input: VoucherInput
): Promise<Voucher> {
  const currentDate = new Date();

  const voucher = await prisma.voucher.findFirst({
    where: {
      code: input.code,
      isActive: true,
      startDate: { lte: currentDate },
      expiryDate: { gte: currentDate },
      AND: [
        {
          OR: [
            { isForAllCategories: true },
            {
              categories: {
                some: {
                  categoryId: parseInt(input.categoryId),
                },
              },
            },
          ],
        },
        {
          OR: [{ minPurchase: null }, { minPurchase: { lte: input.amount } }],
        },
      ],
    },
  });

  if (!voucher) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Kode voucher tidak valid atau tidak berlaku untuk kategori ini',
    });
  }

  // Check if voucher has reached usage limit
  if (voucher.usageLimit !== null && voucher.usageCount >= voucher.usageLimit) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Voucher ini telah mencapai batas penggunaan maksimum',
    });
  }

  return voucher;
}

/**
 * Calculates the discount amount based on voucher type and purchase amount
 * @param voucher - The voucher object
 * @param amount - The original purchase amount
 * @returns Object containing discount amount and final amount
 */
function calculateDiscount(voucher: any, amount: number): DiscountResult {
  let discountAmount = 0;

  // Handle percentage-based discounts
  if (voucher.discountType === 'percentage') {
    // Ensure percentage is valid (0-100)
    const validPercentage = Math.min(Math.max(voucher.discountValue, 0), 100);
    discountAmount = (amount * validPercentage) / 100;

    // Apply max discount cap if exists
    if (voucher.maxDiscount !== null && discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
  }
  // Handle fixed amount discounts
  else if (voucher.discountType === 'fixed') {
    discountAmount = voucher.discountValue;

    // Don't allow negative final amounts
    if (discountAmount > amount) {
      discountAmount = amount;
    }
  }

  // Round to two decimal places for money values
  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalAmount = Math.round((amount - discountAmount) * 100) / 100;

  return { discountAmount, finalAmount };
}

/**
 * Updates voucher usage count and potentially deactivates it if limit reached
 * @param prisma - Prisma client instance
 * @param voucher - The voucher object
 */
async function updateVoucherUsage(
  prisma: Prisma.TransactionClient,
  voucher: any
): Promise<void> {
  // Increment usage count
  await prisma.voucher.update({
    where: { id: voucher.id },
    data: { usageCount: { increment: 1 } },
  });

  // Check if we've hit the limit and deactivate if needed
  if (
    voucher.usageLimit !== null &&
    voucher.usageCount + 1 >= voucher.usageLimit
  ) {
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: { isActive: false },
    });
  }
}

/**
 * Public procedure for applying a voucher to a transaction
 */
export const applyVoucher = publicProcedure
  .input(
    z.object({
      code: z.string().trim().min(1, 'Kode voucher tidak boleh kosong'),
      categoryId: z.string().trim(),
      amount: z.number().positive('Jumlah harus lebih dari 0'),
    })
  )
  .mutation(async ({ ctx, input }): Promise<VoucherResult> => {
    try {
      // Use transaction to ensure all operations are atomic
      return await ctx.prisma.$transaction(
        async (prisma) => {
          // Step 1: Validate voucher existence and eligibility
          const voucher = await validateVoucher(prisma, input);

          // Step 2: Calculate discount amount
          const { discountAmount, finalAmount } = calculateDiscount(
            voucher,
            input.amount
          );

          // Step 3: Increment usage count and potentially deactivate voucher
          await updateVoucherUsage(prisma, voucher);

          // Step 4: Return the result
          return {
            success: true,
            voucherId: voucher.id,
            discountAmount,
            finalAmount,
            message: 'Voucher berhasil diterapkan pada transaksi',
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Ensure strong consistency
        }
      );
    } catch (error) {
      // Forward TRPC errors as-is
      if (error instanceof TRPCError) {
        throw error;
      }

      // Log the error for server-side debugging
      console.error('Voucher application error:', error);

      // Convert other errors to TRPC errors
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan saat menerapkan voucher',
        cause: error,
      });
    }
  });

// For completeness, here's how you would define the Voucher model in TypeScript
// This assumes you're using something like zod for schema validation

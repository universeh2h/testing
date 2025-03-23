import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { Digiflazz } from '@/lib/digiflazz';
import { 
  DIGI_KEY, 
  DIGI_USERNAME, 
  DUITKU_API_KEY, 
  DUITKU_BASE_URL, 
  DUITKU_CALLBACK_URL, 
  DUITKU_EXPIRY_PERIOD, 
  DUITKU_MERCHANT_CODE
} from '@/constants';
import { getProfile } from '@/app/(auth)/auth/components/server';
import { GenerateRandomId } from '@/utils/generateRandomId';
import { Prisma } from '@prisma/client';
import { handleOrderStatusChange } from '@/lib/whatsapp-message';

export type RequestPayment = {
  noWa: string;
  layanan: string;
  paymentCode: string;
  accountId: string;
  serverId: string;
  voucherCode?: string;
  game: string;
  typeTransaksi: string;
  nickname: string;
};


/**
 * Helper function for safely processing vouchers with race condition handling
 */
async function processVoucher(
  tx: Prisma.TransactionClient,
  voucherCode: string,
  price: number,
  categoryDetails: any
) {
  // First find the voucher
  const voucher = await tx.voucher.findFirst({
    where: {
      code: voucherCode,
      isActive: true,
      expiryDate: { gt: new Date() },
      startDate: { lte: new Date() },
    },
    include: {
      categories: true,
    },
  });

  if (!voucher) {
    throw new Error('Invalid or expired voucher code');
  }

  // Lock the voucher row to prevent concurrent modifications
  await tx.$executeRaw`SELECT * FROM vouchers WHERE id = ${voucher.id} FOR UPDATE`;
  
  // Refetch after locking to get the most up-to-date state
  const lockedVoucher = await tx.voucher.findUnique({
    where: { id: voucher.id },
  });
  
  if (!lockedVoucher) {
    throw new Error('Voucher no longer available');
  }
  
  // Check usage limits
  if (
    lockedVoucher.usageLimit &&
    lockedVoucher.usageCount >= lockedVoucher.usageLimit
  ) {
    throw new Error('Voucher usage limit reached');
  }

  // Check minimum purchase requirement
  if (voucher.minPurchase && price < voucher.minPurchase) {
    throw new Error(`Minimum purchase of ${voucher.minPurchase} required for this voucher`);
  }

  // Verify voucher applicability to this category
  const isApplicable =
    voucher.isForAllCategories ||
    voucher.categories.some(vc => vc.categoryId === categoryDetails.id);

  if (!isApplicable) {
    throw new Error('Voucher not applicable to this product category');
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    discountAmount = (price * voucher.discountValue) / 100;
    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscount);
    }
  } else {
    discountAmount = voucher.discountValue;
  }

  // Update voucher usage count immediately while we have the lock
  await tx.voucher.update({
    where: { id: voucher.id },
    data: { usageCount: { increment: 1 } },
  });

  return {
    price: Math.max(0, price - discountAmount),
    discountAmount,
    appliedVoucherId: voucher.id
  };
}

export async function POST(req: NextRequest) {
  try {
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);
    const body = await req.json();
    const session = await getProfile();
    
    const {
      layanan,
      paymentCode,
      noWa,
      voucherCode,
      serverId,
      typeTransaksi,
      game,
      nickname,
      accountId,
    }: RequestPayment = body;

    // Validate required input
    if (!paymentCode || !layanan || !noWa) {
      return NextResponse.json(
        {
          statusCode: '400',
          statusMessage: 'Missing required parameters',
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!DUITKU_MERCHANT_CODE || !DUITKU_API_KEY) {
      console.error('Missing Duitku configuration');
      return NextResponse.json(
        {
          statusCode: '500',
          statusMessage: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Generate order IDs
    const merchantOrderId = GenerateRandomId();
    const paymentReference = GenerateRandomId();
    const baseUrl = process.env.NEXTAUTH_URL || '';

    // Start transaction with strong isolation level
    return await prisma.$transaction(
      async (tx) => {
        // Get product details
        const productDetails = await tx.layanan.findFirst({
          where: { layanan },
        });

        if (!productDetails) {
          return NextResponse.json(
            { statusCode: 404, message: 'Product not found' },
            { status: 404 }
          );
        }

        // Get category for voucher validation
        const categoryDetails = await tx.categories.findFirst({
          where: { id: productDetails.kategoriId },
        });

        if (!categoryDetails) {
          return NextResponse.json(
            { statusCode: 404, message: 'Category not found' },
            { status: 404 }
          );
        }

        // Calculate base price
        let price: number;
        let discountAmount = 0;
        let appliedVoucherId: number | null = null;

        // Apply pricing rules
        if (
          productDetails.isFlashSale &&
          productDetails.expiredFlashSale &&
          new Date(productDetails.expiredFlashSale) > new Date()
        ) {
          price = productDetails.hargaFlashSale || 0;
        } else if (session?.session?.role === 'Platinum') {
          price = productDetails.hargaPlatinum;
        } else {
          price = productDetails.harga;
        }

        // Process voucher if provided
        if (voucherCode) {
          try {
            const voucherResult = await processVoucher(tx, voucherCode, price, categoryDetails);
            price = voucherResult.price;
            discountAmount = voucherResult.discountAmount;
            appliedVoucherId = voucherResult.appliedVoucherId;
          } catch (error: any) {
            return NextResponse.json(
              { statusCode: 400, message: error.message },
              { status: 400 }
            );
          }
        }

        const paymentAmount = price;

        // Get payment method details
        const metode = await tx.method.findFirst({
          where: { code: paymentCode }
        });
        
        // Create transaction record
        const transaction = await tx.pembayaran.create({
          data: {
            orderId: merchantOrderId,
            metode: metode?.name ?? paymentCode,
            reference: paymentReference,
            status: 'PENDING',
            noPembeli: parseInt(noWa),
            harga: paymentAmount.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Get user ID if logged in
        let userId = null;
        if (session?.session?.id) {
          const userExists = await tx.users.findUnique({
            where: { id: session.session.id },
          });

          if (userExists) {
            userId = session.session.id;
          }
        }
        
        // Get service details
        const layanans = await tx.layanan.findFirst({
          where: { layanan },
        });

        // Create purchase record
        await tx.pembelian.create({
          data: {
            harga: paymentAmount,
            layanan,
            orderId: merchantOrderId,
            profit: productDetails.profit,
            status: 'PENDING',
            tipeTransaksi: 'Top Up',
            username: session?.session?.username || 'Guest',
            userId: accountId,
            zone: serverId,
            providerOrderId: layanans?.providerId,
            nickname,
            refId: paymentReference,
            isDigi: true,
            successReportSended: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Prepare WhatsApp notifications
        const invoiceLink = `${baseUrl}/invoice?invoice=${merchantOrderId}`;
        const customerName = session?.session?.username ?? "Guest";

        // Handle SALDO payment method
        if (session?.session?.id && paymentCode === "SALDO") {
          // Lock user record for balance check
          await tx.$executeRaw`SELECT * FROM users WHERE id = ${session.session.id} FOR UPDATE`;
          
          // Check balance
          const user = await tx.users.findUnique({
            where: { id: session.session.id },
            select: { balance: true }
          });
          
          if (!user || user.balance < paymentAmount) {
            return NextResponse.json(
              { statusCode: 400, message: 'Saldo tidak mencukupi' },
              { status: 400 }
            );
          }
          
          // Deduct balance
          await tx.users.update({
            where: { id: session.session.id },
            data: { balance: { decrement: paymentAmount } }
          });
          
          // Update payment status
          await tx.pembayaran.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'PAID',
              updatedAt: new Date()
            }
          });
          
          // Update purchase status
          await tx.pembelian.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'PAID',
              updatedAt: new Date()
            }
          });
        
          // Process with Digiflazz
          const digiResponse = await digiflazz.TopUp({
            productCode: layanans?.providerId as string,
            userId: accountId,
            serverId: serverId,
            reference: paymentReference
          });
          
          // Update status based on Digiflazz response
          const digiData = digiResponse?.data;
          if (digiData) {
            await tx.pembelian.update({
              where: { orderId: merchantOrderId },
              data: { 
                status: digiData.status === 'Pending' ? 'PROCESS' : 
                         digiData.status === 'Sukses' ? 'SUCCESS' : 'FAILED',
                sn: digiData.sn,
                updatedAt: new Date()
              }
            });
          }

          // Send WhatsApp notifications for SALDO payment
          await handleOrderStatusChange({
            orderData: {
              amount: paymentAmount,
              link: invoiceLink,
              productName: layanan,
              status: 'PAID',
              customerName,
              method: 'SALDO',
              orderId: merchantOrderId,
              whatsapp: noWa
            }
          });

          // Return success response
          return NextResponse.json({
            reference: paymentReference,
            statusCode: "00",
            paymentUrl: `${baseUrl}/invoice?invoice=${merchantOrderId}`,
            statusMessage: "PROCESS",
            merchantOrderId: merchantOrderId,
            transactionId: transaction.id,
          });
        }

        const signature = crypto
          .createHash('md5')
          .update(
            DUITKU_MERCHANT_CODE +
            merchantOrderId +
            paymentAmount +
            DUITKU_API_KEY
          )
          .digest('hex');

        // Prepare Duitku payload
        const payload = {
          merchantCode: DUITKU_MERCHANT_CODE,
          paymentAmount: paymentAmount,
          merchantOrderId: merchantOrderId,
          productDetails: layanan,
          paymentMethod: paymentCode,
          customerVaName: nickname,
          phoneNumber: noWa,
          returnUrl: `${baseUrl}/invoice/${merchantOrderId}`,
          callbackUrl: DUITKU_CALLBACK_URL,
          signature: signature,
          expiryPeriod: DUITKU_EXPIRY_PERIOD,
        };

        try {
          // Call Duitku API
          const response = await axios.post(
            `${DUITKU_BASE_URL}/api/merchant/v2/inquiry`,
            payload,
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );

          const data = response.data;

          // Validate response
          if (!data.statusCode) {
            return NextResponse.json(
              {
                success: false,
                message: 'Invalid response from payment gateway',
              },
              { status: 500 }
            );
          }
          
          // Categorize payment methods
          const urlPaymentMethods = ['DA', 'OV', 'SA', 'QR']; 
          const vaPaymentMethods = ['I1', 'BR', 'B1', 'BT', 'SP', 'FT', 'M2', 'VA']; 
          
          // Prepare payment info based on method type
          let updateData = {
            reference: paymentReference,
            updatedAt: new Date(),
            noPembayaran: ''
          };
          
          if (urlPaymentMethods.includes(paymentCode)) {
            updateData.noPembayaran = data.paymentUrl;
          } else if (vaPaymentMethods.includes(paymentCode)) {
            updateData.noPembayaran = data.vaNumber || '';
          } else {
            updateData.noPembayaran = data.vaNumber || data.paymentUrl || '';
          }
          
          // Update payment record
          await tx.pembayaran.update({
            where: { orderId: merchantOrderId },
            data: updateData
          });

          // Send WhatsApp notifications for pending payment
          await handleOrderStatusChange({
            orderData: {
              amount: paymentAmount,
              link: invoiceLink,
              productName: layanan,
              status: 'PENDING',
              customerName,
              method: metode?.name || paymentCode,
              orderId: merchantOrderId,
              whatsapp: noWa
            }
          });
          
          // Return success response
          return NextResponse.json({
            paymentUrl: data.paymentUrl,
            reference: paymentReference, 
            providerReference: data.reference,
            statusCode: data.statusCode,
            statusMessage: data.statusMessage,
            merchantOrderId: merchantOrderId,
            transactionId: transaction.id,
          });
        } catch (apiError: any) {
          console.error('Payment gateway error:', apiError.message);
          
          // Update status to FAILED
          await tx.pembayaran.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'FAILED',
              updatedAt: new Date()
            }
          });
          
          await tx.pembelian.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'FAILED',
              updatedAt: new Date()
            }
          });

          return NextResponse.json(
            {
              statusCode: apiError.response?.status || '500',
              statusMessage: apiError.response?.data?.message || 'Payment gateway error',
            },
            { status: apiError.response?.status || 500 }
          );
        }
      },
      {
        maxWait: 5000, 
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      }
    );
  } catch (error: any) {
    console.error('Transaction processing error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
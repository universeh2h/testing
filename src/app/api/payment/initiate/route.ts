import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';
import { prisma } from '@/lib/prisma';
import { Digiflazz } from '@/lib/digiflazz';
import { DIGI_KEY, DIGI_USERNAME, DUITKU_API_KEY, DUITKU_BASE_URL, DUITKU_CALLBACK_URL, DUITKU_EXPIRY_PERIOD, DUITKU_MERCHANT_CODE, DUITKU_RETURN_URL } from '@/constants';
import { getProfile } from '@/app/(auth)/auth/components/server';
import { GenerateRandomId } from '@/utils/generateRandomId';
import { Prisma } from '@prisma/client';

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

interface PaymentResponse {
  paymentUrl: string;
  reference: string;
  providerReferenceId?: string;
  statusCode: string;
  statusMessage: string;
  merchantOrderId: string;
  transactionId: number | string;
}

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

  // Lock the voucher row using a raw SQL FOR UPDATE statement
  // This prevents other transactions from modifying this voucher during our processing
  await tx.$executeRaw`SELECT * FROM vouchers WHERE id = ${voucher.id} FOR UPDATE`;
  
  // Refetch the voucher after locking to get the most up-to-date usage count
  const lockedVoucher = await tx.voucher.findUnique({
    where: { id: voucher.id },
  });
  
  if (!lockedVoucher) {
    throw new Error('Voucher no longer available');
  }
  
  // Check if usage limit is reached using the latest count
  if (
    lockedVoucher.usageLimit &&
    lockedVoucher.usageCount >= lockedVoucher.usageLimit
  ) {
    throw new Error('Voucher usage limit reached');
  }

  // Check if minimum purchase requirement is met
  if (voucher.minPurchase && price < voucher.minPurchase) {
    throw new Error(`Minimum purchase of ${voucher.minPurchase} required for this voucher`);
  }

  // Check if voucher is applicable to this category
  const isApplicable =
    voucher.isForAllCategories ||
    voucher.categories.some(
      (vc) => vc.categoryId === categoryDetails.id
    );

  if (!isApplicable) {
    throw new Error('Voucher not applicable to this product category');
  }

  // Calculate discount
  let discountAmount = 0;
  if (voucher.discountType === 'PERCENTAGE') {
    // Apply percentage discount
    discountAmount = (price * voucher.discountValue) / 100;
    if (voucher.maxDiscount) {
      discountAmount = Math.min(
        discountAmount,
        voucher.maxDiscount
      );
    }
  } else {
    discountAmount = voucher.discountValue;
  }

  // Update voucher usage count immediately while we still have the lock
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

    console.log(body);

    // Validasi input
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

    // Generate consistent merchant order ID and payment reference
    const merchantOrderId = GenerateRandomId();
    const paymentReference = GenerateRandomId();

    // Start a Prisma transaction with isolation level serializable for strongest consistency
    return await prisma.$transaction(
      async (tx) => {
        // Fetch the service details
        const productDetails = await tx.layanan.findFirst({
          where: { layanan },
        });

        if (!productDetails) {
          return NextResponse.json(
            { statusCode: 404, message: 'Product NotFound' },
            { status: 404 }
          );
        }

        // Get category details for voucher validation
        const categoryDetails = await tx.categories.findFirst({
          where: { id: productDetails.kategoriId },
        });

        if (!categoryDetails) {
          return NextResponse.json(
            { statusCode: 404, message: 'Category NotFound' },
            { status: 404 }
          );
        }

        // Base price calculation
        let price: number;
        let discountAmount = 0;
        let appliedVoucherId: number | null = null;

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

        // Apply voucher if provided using our race-condition-safe function
        if (voucherCode) {
          try {
            const voucherResult = await processVoucher(tx, voucherCode, price, categoryDetails);
            price = voucherResult.price;
            discountAmount = voucherResult.discountAmount;
            appliedVoucherId = voucherResult.appliedVoucherId;
          } catch (error) {
            return NextResponse.json(
              { statusCode: 400, message: error?.message },
              { status: 400 }
            );
          }
        }

        const paymentAmount = price;

        const metode = await tx.method.findFirst({
          where: {
            code: paymentCode
          }
        });
    
        console.log(price);
        
        // Create transaction record in Pembayaran table
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

        // Add userId only if a user is logged in
        let userId = null;
        if (session?.session?.id) {
          // Check if user exists first
          const userExists = await tx.users.findUnique({
            where: { id: session.session.id },
          });

          if (userExists) {
            userId = session.session.id;
          }
        }
 
        
        const layanans = await tx.layanan.findFirst({
          where: {
            layanan,
          },
        });

        // Create pembelian record with the same reference
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

        // Check deposit availability if user is logged in and payment method is SALDO
        if (session?.session?.id && paymentCode === "SALDO") {
          // Lock the user record to prevent concurrent balance modifications
          await tx.$executeRaw`SELECT * FROM users WHERE id = ${session.session.id} FOR UPDATE`;
          
          // Check if user has enough balance
          const user = await tx.users.findUnique({
            where: { id: session.session.id },
            select: { balance: true }
          });
          
          if (!user || user.balance < paymentAmount) {
            return NextResponse.json(
              { statusCode: 400, message: 'Saldo anda tidak mencukupi' },
              { status: 400 }
            );
          }
          
          // Deduct balance from user
          await tx.users.update({
            where: { id: session.session.id },
            data: { balance: { decrement: paymentAmount } }
          });
          
          // Update pembayaran status to PAID
          await tx.pembayaran.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'PAID',
              updatedAt: new Date()
            }
          });
          
          // Update pembelian status to PAID - ref_id already set
          await tx.pembelian.update({
            where: { orderId: merchantOrderId },
            data: { 
              status: 'PAID',
              updatedAt: new Date()
            }
          });
        
          console.log(layanans?.providerId);
          // Send to Digiflazz using our consistent reference ID
          const reqtoDigi = await digiflazz.TopUp({
            productCode: layanans?.providerId as string,
            userId: accountId,
            serverId: serverId,
            reference: paymentReference
          });
          
          const datas = reqtoDigi?.data;
          if(datas) {
            await tx.pembelian.update({
              where: { orderId: merchantOrderId },
              data: { 
                status: datas.status === 'Pending' ? 'PROCESS' : 
                       datas.status === 'Sukses' ? 'SUCCESS' : 'FAILED',
                sn: datas.sn,
                updatedAt: new Date()
              }
            });
          }
          
          // Return success response
          return NextResponse.json({
            reference: paymentReference,
            statusCode: "00",
            paymentUrl: `${process.env.NEXTAUTH_URL}/invoice?invoice=${merchantOrderId}`,
            statusMessage: "PROCESS",
            merchantOrderId: merchantOrderId,
            transactionId: transaction.id,
          });
        }

        // Generate signature for Duitku
        const signature = crypto
          .createHash('md5')
          .update(
            DUITKU_MERCHANT_CODE +
              merchantOrderId +
              paymentAmount +
              DUITKU_API_KEY
          )
          .digest('hex');

        const payload = {
          merchantCode: DUITKU_MERCHANT_CODE,
          paymentAmount: paymentAmount,
          merchantOrderId: merchantOrderId,
          productDetails: layanan,
          paymentMethod: paymentCode,
          customerVaName: nickname,
          phoneNumber: noWa,
          returnUrl: `${process.env.NEXTAUTH_URL}/invoice/${merchantOrderId}`,
          callbackUrl: DUITKU_CALLBACK_URL,
          signature: signature,
          expiryPeriod: DUITKU_EXPIRY_PERIOD,
        };

        try {
          const response = await axios.post(
            `${DUITKU_BASE_URL}/api/merchant/v2/inquiry`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('Duitku API response:', response.data);
          const data = response.data;

          // Check for valid response
          if (!data.statusCode) {
            return NextResponse.json(
              {
                success: false,
                message: 'Invalid response from API: ' + JSON.stringify(data),
              },
              { status: 500 }
            );
          }
          
          // Store Duitku's reference separately
          const urlPaymentMethods = ['DA', 'OV', 'SA', 'QR']; // DANA, OVO, ShopeePay, QRIS
          const vaPaymentMethods = ['I1', 'BR', 'B1', 'BT', 'SP', 'FT', 'M2', 'VA']; // Various bank VAs
          
          // Prepare update data based on payment method
          let updateData: any = {
            reference: paymentReference,
            updatedAt: new Date()
          };
          
          // Add the appropriate payment information based on payment method
          if (urlPaymentMethods.includes(paymentCode)) {
            updateData.noPembayaran = data.paymentUrl;
          } else if (vaPaymentMethods.includes(paymentCode)) {
            updateData.noPembayaran = data.vaNumber || '';
          } else {
            updateData.noPembayaran = data.vaNumber || data.paymentUrl || '';
          }
          
          // Update the pembayaran record with the appropriate information
          await tx.pembayaran.update({
            where: { orderId: merchantOrderId },
            data: updateData
          });
          
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
          console.error('Duitku API error:', apiError.message);
          console.error('Response data:', apiError.response?.data);

          // Update transaction status to FAILED in case of error
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
              statusMessage:
                apiError.response?.data?.message || 'Payment gateway error',
            },
            { status: apiError.response?.status || 500 }
          );
        }
      },
      {
        maxWait: 5000, 
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable // Use the strongest isolation level
      }
    );
  } catch (error) {
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
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto, { randomUUID } from 'crypto';
import { DUITKU_API_KEY, DUITKU_MERCHANT_CODE } from '@/constants';
import { findUserById, getProfile } from '@/app/(auth)/auth/components/server';
import { Duitku } from '../duitku/duitku';
import { GenerateRandomId } from '@/utils/generateRandomId';
export function GenerateMerchantOrderID(depositId: number, userId: number) {
  return `DEP-${userId}-${depositId}-${Date.now()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const duitku = new Duitku();
    const { amount, code } = body;
    const session = await getProfile();
    
    if (!session?.session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findUserById(session.session.id);

    if (!user) {
      return NextResponse.json({ error: 'User not Found' }, { status: 404 });
    }

    // Mencari metode pembayaran
    const method = await prisma.method.findFirst({
      where: { code },
      select: { name: true,code : true },
    });

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Combine all database operations into a single transaction
const result = await prisma.$transaction(async (tx) => {
  const noPembayaran = GenerateRandomId('DEP');
  
  // Create deposit record
  const deposit = await tx.deposits.create({
    data: {
      username: user.username,
      metode: method.name,
      status: 'PENDING',
      jumlah: amount,
      noPembayaran,
      depositId: noPembayaran,
      createdAt: new Date()
    },
  });

  // Create timestamp and signature
  const timestamp = Math.floor(Date.now() / 1000);
  const paymentAmount = amount.toString();
  const signature = crypto
    .createHash('md5')
    .update(
      DUITKU_MERCHANT_CODE + noPembayaran + paymentAmount + DUITKU_API_KEY
    )
    .digest('hex');

  return { deposit, timestamp, signature, noPembayaran };
});

// Now create payment in Duitku - after DB transaction is complete
const paymentData = await duitku.Create({
  amount,
  code,
  merchantOrderId: result.noPembayaran,
  productDetails: `Deposit for ${user.username}`,
  sign: result.signature,
  time: result.timestamp,
  username: user.username,
  returnUrl: `${process.env.NEXTAUTH_URL}/profile`,
});

// Handle payment response in another transaction
await prisma.$transaction(async (tx) => {
  // Check if payment creation was successful
  if (paymentData.statusCode !== '00') {
    await tx.deposits.update({
      where: { id: result.deposit.id },
      data: { status: 'FAILED' },
    });
    
    throw new Error(`Failed to create payment: ${paymentData.statusMessage}`);
  }

  const urlPaymentMethods = ['DA', 'OV', 'SA', 'QR']; 
  const vaPaymentMethods = ['I1', 'BR', 'B1', 'BT', 'SP', 'FT', 'M2', 'VA']; 
  
  // Determine noPembayaran value based on payment method
  let noPayment = '';
  if (urlPaymentMethods.includes(method.code)) {
    noPayment = paymentData.paymentUrl;
  } else if (vaPaymentMethods.includes(method.code)) {
    noPayment = paymentData.vaNumber || '';
  } else {
    noPayment = paymentData.vaNumber || paymentData.paymentUrl || '';
  }

  // Update deposit with payment information
  await tx.deposits.update({
    where: { id: result.deposit.id },
    data: { 
      noPembayaran: noPayment,
      updatedAt: new Date()
    },
  });
});
  
    return NextResponse.json({
      data : result.deposit,
      status: true,
      statusCode: 201,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
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
      select: { name: true },
    });

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    const noPembayaran  =  GenerateRandomId('DEP')
    // Gunakan transaksi Prisma untuk menjaga konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // Buat catatan deposit terlebih dahulu
      const deposit = await tx.deposits.create({
        data: {
          username: user.username,
          metode: method.name,
          status: 'PENDING',
          jumlah: amount,
          noPembayaran,
          createdAt : new Date()
        },
      });
    
      // Buat timestamp dan tanda tangan
      const timestamp = Math.floor(Date.now() / 1000);
      const paymentAmount = amount.toString();
      const signature = crypto
        .createHash('md5')
        .update(
          DUITKU_MERCHANT_CODE + noPembayaran + paymentAmount + DUITKU_API_KEY
        )
        .digest('hex');
    
      return { deposit, timestamp, signature };
    });

    // Sekarang buat pembayaran di Duitku - setelah transaksi DB selesai
    const paymentData = await duitku.Create({
      amount,
      code,
      merchantOrderId: noPembayaran,
      productDetails: `Deposit for ${user.username}`,
      sign: result.signature,
      time: result.timestamp,
      username: user.username,
      returnUrl: `${process.env.NEXTAUTH_URL}/profile`,
    });

    // Periksa apakah pembuatan pembayaran berhasil
    if (paymentData.statusCode !== '00') {
      // Perbarui kedua catatan ke status GAGAL
      await prisma.$transaction([
        prisma.deposits.update({
          where: { id: result.deposit.id },
          data: { status: 'FAILED' },
        }),
       
      ]);

      return NextResponse.json(
        {
          error: 'Failed to create payment',
          details: paymentData.statusMessage,
        },
        { status: 400 }
      );
    }

  
    return NextResponse.json({
      paymentUrl: paymentData.paymentUrl,
      status: true,
      statusCode: 200,
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
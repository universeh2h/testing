import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Digiflazz } from '@/lib/digiflazz';
import { DIGI_KEY, DIGI_USERNAME, DUITKU_MERCHANT_CODE } from '@/constants';

export async function POST(req: NextRequest) {
  try {
    // Get callback data from Duitku
    let callbackData;
    const digiflazz = new Digiflazz(DIGI_USERNAME, DIGI_KEY);

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      callbackData = await req.json();
    } else {
      const formData = await req.formData();
      callbackData = Object.fromEntries(formData.entries());

      if (callbackData.amount) {
        callbackData.amount = callbackData.amount.toString();
      }
    }

    console.log('called callback request');
    console.log('Received callback data:', callbackData);

    // Extract important fields
    const {
        merchantCode,
        amount,
        merchantOrderId,       
        productDetail,
        additionalParam,
        resultCode,
        signature,    
        paymentCode,
        merchantUserId,
        reference,
        spUserHash,
        settlementDate,
        publisherOrderId,
        sourceAccount
    } = callbackData;

    // Validate required fields
    if (
      !merchantCode ||
      !merchantOrderId ||
      !amount ||
      !signature ||
      !resultCode
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate merchantCode
    if (merchantCode !== DUITKU_MERCHANT_CODE) {
      console.error('Invalid merchant code:', merchantCode);
      return NextResponse.json(
        { success: false, message: 'Invalid merchant code' },
        { status: 400 }
      );
    }

    // Using Prisma transaction for all database operations
    return await prisma.$transaction(async (tx) => {
      const depositIdMatch = merchantOrderId.match(/^DEP-(\d+)/);
      const orderTopUp = merchantOrderId.match(/^VAZ-(\d+)/);
        
      if (depositIdMatch) {
        const deposit = await tx.deposits.findFirst({
          where: {
            noPembayaran: merchantOrderId
          },
        });

        console.log('Deposit:', deposit);
        
        if (!deposit) {
          return NextResponse.json({
            success: false,
            message: 'Deposit not found'
          }, { status: 404 });
        }
        
        // Update deposit status based on resultCode
        const newStatus = resultCode === '00' ? 'SUCCESS' : 'FAILED';
        
        await tx.deposits.update({
          where: { id: deposit.id },
          data: { 
            status: newStatus,
            updatedAt: new Date()
          }
        });
        
        // If successful payment, could add credit to user account here
        if (newStatus === 'SUCCESS') {
          // Add credit to user account logic
          const user = await tx.users.findUnique({
            where: {
              username: deposit.username
            }
          });
          
          if (user) {
            await tx.users.update({
              where: { username: deposit.username },
              data: { 
                balance: { increment: deposit.jumlah }
              }
            });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Deposit ${newStatus}`,
          data: {
            orderId: merchantOrderId,
            status: newStatus
          }
        });
      }
     
      if (orderTopUp) {
        // Find the pembelian record
        const pembelian = await tx.pembelian.findFirst({
          where: {
            orderId: merchantOrderId,
          },
        });
        
        const layanan = await tx.layanan.findFirst({
          where: {
            layanan: productDetail,
          },
        });
        
        console.log('Layanan:', layanan);
        console.log('Pembelian:', pembelian);

        if (layanan && pembelian) {
      
          const reqtoDigi = await digiflazz.TopUp({
            productCode: layanan.providerId as string,
            userId: pembelian.userId as string,
            reference: merchantOrderId as string,
            serverId: pembelian.zone as string
          });
          
          const datas = reqtoDigi?.data;
          console.log(datas);
          
          if (datas) {
            const currentPembelianStatus = pembelian.status;
            const newStatus = datas.status === 'Pending' ? 'PROCESS' : 
                             datas.status === 'Sukses' ? 'SUCCESS' : 'FAILED';
            
            if (currentPembelianStatus !== 'SUCCESS' || newStatus === 'SUCCESS') {
              await tx.pembelian.update({
                where: { orderId: merchantOrderId },
                data: { 
                  status: newStatus,
                  sn: datas.sn,
                  refId: datas.ref_id,
                  updatedAt: new Date()
                }
              });
            } else {
              console.log(`Skipping pembelian update because current status (${currentPembelianStatus}) is SUCCESS and new status is ${newStatus}`);
            }
          }
        } else {
          console.log('Layanan or pembelian not found');
          return NextResponse.json({
            success: false, 
            message: 'Layanan or pembelian not found'
          }, { status: 200 }); // Use 200 to avoid retries
        }
      }

      // Return success response to Duitku
      return NextResponse.json({ success: true });
    }, {
      maxWait: 5000, 
      timeout: 10000  
    });
  } catch (error) {
    console.error('Callback processing error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Error processing callback',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 even on error to prevent Duitku from retrying
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse the callback data from Digiflazz
    const callbackData = await req.json();
    console.log('Digiflazz callback received:', JSON.stringify(callbackData));
    
    const {
      ref_id,
      buyer_sku_code,
      customer_no,
      status,
      message,
      sn,
    } = callbackData.data;
    
    const referenceId = ref_id;
    console.log('Processing reference ID:', referenceId);

    // Validate required parameters
    if (!referenceId || !buyer_sku_code || !customer_no) {
      console.log('Missing required parameters');
      return NextResponse.json({
        data: {
          status: "2",
          message: "Terdapat parameter yang kosong",
          rc: "07"
        }
      });
    }

    // Map Digiflazz status to your application status - using trim and case insensitive comparison
    const normalizedStatus = status ? status.trim().toLowerCase() : '';
    console.log('Original status:', status);
    console.log('Normalized status:', normalizedStatus);
    
    // Simplified status mapping - only SUCCESS or FAILED
    const purchaseStatus = normalizedStatus === 'sukses' ? 'SUCCESS' : 'FAILED';
    
    console.log('Mapped purchase status:', purchaseStatus);

    // Find the pembelian record using the ref_id
    const pembelian = await prisma.pembelian.findFirst({
      where: {
        refId: referenceId
      }
    });

    if (!pembelian) {
      console.log('Pembelian not found for refId:', referenceId);
      return NextResponse.json({
        data: {
          status: "2",
          message: "Pembelian tidak ditemukan",
          rc: "04"
        }
      });
    }

    // Update the pembelian record with the callback data
    const updatedPembelian = await prisma.pembelian.update({
      where: {
        id: pembelian.id
      },
      data: {
        status: purchaseStatus,
        sn: sn || null,
        log: message || '',
        updatedAt: new Date(),
      }
    });

    console.log('Pembelian updated successfully:', updatedPembelian.id);

    // If status is SUCCESS and success report hasn't been sent yet, mark it as sent
    if (purchaseStatus === 'SUCCESS' && !pembelian.successReportSended) {
      await prisma.pembelian.update({
        where: {
          id: pembelian.id
        },
        data: {
          successReportSended: true
        }
      });
      
      // Here you can add additional logic for sending success notifications
      console.log('Success report marked as sent for pembelian:', pembelian.id);
    }

    return NextResponse.json({
      data: {
        status: "0",
        message: "Callback processed successfully",
        rc: "00"
      }
    });

  } catch (error) {
    console.error('DigiFlazz callback error:', error);
    return NextResponse.json({
      data: {
        status: "2",
        message: "System error",
        rc: "99"
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}
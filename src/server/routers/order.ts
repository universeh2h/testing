import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { findUserById, getProfile } from '@/app/(auth)/auth/components/server';
import { Digiflazz } from '@/lib/digiflazz';
import { TRANSACTION_FLOW } from '@/types/transaction';
import { Prisma } from '@prisma/client';
import { GenerateRandomId } from '@/utils/generateRandomId';

export const order = router({
  createManual: publicProcedure
  .input(z.object({
    categoryId: z.string(),
    layananId: z.string(),
    userId: z.string(),
    serverId: z.string().optional(),
    whatsapp: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      const user = await getProfile()
      const username = process.env.DIGI_USERNAME as string;
      const DIGI_API_KEY = process.env.DIGI_API_KEY as string;
      const digi = new Digiflazz(username, DIGI_API_KEY);
      
      const generatePaymentReference = (type: string) => {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        return `${type}-${timestamp}-${randomId}`;
      };
      
      if (user?.session.role !== 'Admin' ) {
        return {
          status: false,
          message: 'failed to create',
          statusCode: 401,
        };
      }
      
      const layanan = await ctx.prisma.layanan.findUnique({
        where: { id: parseInt(input.layananId) },
      });
      
      if (!layanan) {
        return {
          status: false,
          message: 'layanan tidak tersedia',
          statusCode: 404,
        };
      }
      
      const orderId = GenerateRandomId();
      const paymentReference = generatePaymentReference('MANUAL');
      
      // Create payment record first
      const payment = await ctx.prisma.pembayaran.create({
        data: {
          orderId: orderId,
          harga: layanan.harga.toString(),
          noPembeli: parseInt(input.userId),
          status: 'PENDING',
          metode: 'MANUAL',
          reference: paymentReference,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      // Execute Digiflazz topup
      const digiTrans = await digi.TopUp({
        productCode: layanan.providerId,
        userId: input.userId,
        serverId: input.serverId,
        reference: paymentReference,
      });
      
      await ctx.prisma.pembelian.create({
        data: {
          orderId: orderId,
          username: user?.session.user.name || 'unknown',
          userId: input.userId,
          zone: input.serverId || '',
          layanan: layanan.layanan,
          harga: layanan.harga,
          profit: layanan.profit || 0,
          providerOrderId: digiTrans?.data?.trx_id?.toString() || '',
          status: 'PENDING',
          isDigi: true,
          refId: paymentReference,
          successReportSended: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      return {
        status: true,
        message: 'Success create manual transaction',
        data: {
          orderId,
          paymentReference,
          digiTransactionId: digiTrans?.data?.trx_id as string,
          productDetail: digiTrans?.data
        },
        statusCode: 200,
      };
      
    } catch (error) {
      if (error instanceof TRPCError) {
        console.error('error : ', error.message);
        return {
          status: false,
          message: error,
          statusCode: 400,
        };
      }
      return {
        status: false,
        message: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }),
    findByUser: publicProcedure
    .input(z.object({
      page: z.number(),
      perPage: z.number(),
      search: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const session = await getProfile()
        const userId = session?.session.id;
        
        if (!userId) {
          return {
            status: false,
            message: "Unauthorized: User not logged in",
            statusCode: 401,
            data: [],
            pagination : {}
          };
        }
        
        const user = await findUserById(userId);
        
        if (!user) {
          return {
            status: false,
            message: "User not found",
            statusCode: 401,
            data: [],
            pagination : {}
          };
        }
        
        // Build the where clause
        const where: Prisma.PembelianWhereInput = {
          username: user.username
        };
        
        // Add search functionality based on schema fields
        if (input.search && input.search.trim() !== '') {
          where.OR = [
            { layanan: { contains: input.search } },
            { orderId: { contains: input.search } },
            { nickname: { contains: input.search } },
            { status: { contains: input.search } },
            { tipeTransaksi: { contains: input.search } }
          ];
        }
        
        // Calculate pagination
        const skip = (input.page - 1) * input.perPage;
        
        // Get total count for pagination info
        const totalCount = await ctx.prisma.pembelian.count({
          where
        });
        
        // Get transactions with pagination
        const transactions = await ctx.prisma.pembelian.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            pembayaran: true
          }
        });
        
        return {
          status: true,
          message: "Transactions retrieved successfully",
          statusCode: 200,
          data: transactions,
          pagination: {
            total: totalCount,
            page: input.page,
            perPage: input.perPage,
            totalPages: Math.ceil(totalCount / input.perPage)
          }
        };
      } catch (error) {
        console.error("Error in findByUser:", error);
        return {
          status: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
          statusCode: 500,
          data: [],
          pagination: {
            total: 0,
            page: input.page,
            perPage: input.perPage,
            totalPages: 0
          }
        };
      }
    }),
    getManualOrders: publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(10),
      page: z.number().optional().default(1),
      status: z.string().optional(),
      search: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    try {
      const { limit, page, status, search } = input;
      const skip = (page - 1) * limit;
      
      // Filter conditions
      const where: Prisma.PembelianWhereInput = {
        pembayaran: {
          metode: 'MANUAL',
        }
      };
      
      // Add status filter if provided
      if (status) {
        where.status = status;
      }
      
      // Add search filter if provided
      if (search) {
        where.OR = [
          { orderId: { contains: search } },
          { username: { contains: search } },
          { userId: { contains: search } },
          { layanan: { contains: search } },
          { providerOrderId: { contains: search } },
          { refId: { contains: search } },
        ];
      }
      
      // Get total count for pagination
      const totalCount = await ctx.prisma.pembelian.count({
        where,
      });
      
      // Get manual orders with payment details
      const manualOrders = await ctx.prisma.pembelian.findMany({
        where,
        include: {
          pembayaran: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
      
      return {
        status: true,
        message: 'Success get manual orders',
        data: {
          orders: manualOrders,
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error getting manual orders:', error);
      return {
        status: false,
        message: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }),
});
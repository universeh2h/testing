import { TRANSACTION_FLOW } from "@/types/transaction";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { X } from "lucide-react";
import { TRPCError } from "@trpc/server";

export const adminStats = publicProcedure.query(async ({ ctx }) => {
  try {
    // Get current date
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get total transactions
    const totalTransactions = await ctx.prisma.pembelian.count();
    
    // Get successful transactions
    const successfulTransactions = await ctx.prisma.pembelian.count({
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Get pending transactions
    const pendingTransactions = await ctx.prisma.pembelian.count({
      where: {
        status: TRANSACTION_FLOW.PENDING
      }
    });
    
    // Get failed transactions
    const failedTransactions = await ctx.prisma.pembelian.count({
      where: {
        status:TRANSACTION_FLOW.FAILED
      }
    });
    
    // Get today's revenue
    const todayRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfToday
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get today's profit
    const todayProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfToday
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get this month's revenue
    const thisMonthRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get this month's profit
    const thisMonthProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get last month's revenue
    const lastMonthRevenue = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth
        }
      },
      _sum: {
        harga: true
      }
    });
    
    // Get last month's profit
    const lastMonthProfit = await ctx.prisma.pembelian.aggregate({
      where: {
        status: TRANSACTION_FLOW.SUCCESS,
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth
        }
      },
      _sum: {
        profit: true
      }
    });
    
    // Get payment method stats
    const paymentMethodStats = await ctx.prisma.pembayaran.groupBy({
      by: ['metode'],
      _count: {
        metode: true
      },
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Get transaction type stats
    const transactionTypeStats = await ctx.prisma.pembelian.groupBy({
      by: ['tipeTransaksi'],
      _count: {
        tipeTransaksi: true
      },
      where: {
        status: TRANSACTION_FLOW.SUCCESS
      }
    });
    
    // Recent transactions
    const recentTransactions = await ctx.prisma.pembelian.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        pembayaran: true
      }
    });

    return {
      totalTransactions,
      statusCounts: {
        successful: successfulTransactions,
        pending: pendingTransactions,
        failed: failedTransactions
      },
      revenue: {
        today: todayRevenue._sum.harga || 0,
        thisMonth: thisMonthRevenue._sum.harga || 0,
        lastMonth: lastMonthRevenue._sum.harga || 0
      },
      profit: {
        today: todayProfit._sum.profit || 0,
        thisMonth: thisMonthProfit._sum.profit || 0,
        lastMonth: lastMonthProfit._sum.profit || 0
      },
      paymentMethodStats,
      transactionTypeStats,
      recentTransactions
    };
  } catch (error) {
    
    throw new Error("Failed to fetch admin statistics");
  }
});


export const PembelianAll = router({
  getId  :  publicProcedure
  .input(
    z.object({
      merchantOrderId: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const { merchantOrderId } = input;
   
    
    // Find purchase (pembelian) details with related data
    const purchase = await ctx.prisma.pembelian.findUnique({
      where: {
        orderId: merchantOrderId
      },
      include: {
      pembayaran : true,
      }
    });
    
    if ( !purchase) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Transaction details not found'
      });
    }
    
    // You could also fetch additional related data
    // For example, if you need layanan details:
    let layananDetails = null;
    if (purchase.layanan) {
      layananDetails = await ctx.prisma.layanan.findFirst({
        where: {
          layanan: purchase.layanan
        }
      });
    }
    
    // Return all the collected data
    return {
      purchase,
      layananDetails,
      // Add any other data you need to return
    }}),
    getAll: publicProcedure
      .input(
        z.object({
          status: z.string().optional(),
          page: z.number().min(1).optional(),
          limit: z.number().min(1).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        try {
          const { status, page = 1, limit = 10 } = input || {};
          const where: Prisma.PembelianWhereInput = {};
  
          // Filter by status if provided
          if (status) {
            where.status = status;
          }
  
          // Calculate skip and take for pagination
          const skip = (page - 1) * limit;
          const take = limit;
  
          // Fetch paginated data and total count
          const [transactions, totalCount] = await Promise.all([
            ctx.prisma.pembelian.findMany({
              where,
              skip,
              take,
              orderBy: { createdAt: 'desc' }, // Optional: Order by creation date
            }),
            ctx.prisma.pembelian.count({ where }),
          ]);
  
          return {
            transactions,
            totalCount,
          };
        } catch (error) {
          console.error("Error fetching pembelian data:", error);
          throw new Error("Failed to fetch pembelian data");
        }
      }),
      trackingInvoice  : publicProcedure.input(z.object({
        invoice: z.string()
      })).query(async({ctx,input})  => {
        try {
          return await ctx.prisma.pembayaran.findFirst({
            where : {
              orderId : input.invoice
            },
            select : {
              orderId : true,
              noPembeli : true,
              status : true,
              updatedAt : true
            }
          })
        } catch (error) {
          throw new Error("Invoice tidak ditemukan")
        }
      }),
      findMostPembelian  : publicProcedure.query(async({ctx})  => {
          return await ctx.prisma.pembayaran.findMany({
            take : 10,
            select : {
                orderId : true,
                noPembeli : true,
                status : true,
                updatedAt : true
            },
            orderBy : {
              createdAt : 'desc'
            }
          })
        
      }),
      getAllPembelianData: publicProcedure
      .query(async ({ ctx }) => {
        const now = new Date();
        
        // Start of today
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        // Start of week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Start of month
        const startOfMonth = new Date(now);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        // Execute all queries in parallel for better performance
        const [ expensiveToday, expensiveWeek, expensiveMonth] = await Promise.all([
          // Recent transactions (by date)
          ctx.prisma.pembayaran.findMany({
            take: 10,
            select: {
              orderId: true,
              harga: true

            },
            orderBy: {
              createdAt: 'desc'
            }
          }),
          
          // Most expensive (all time)
          ctx.prisma.pembayaran.findMany({
            take: 10,
            select: {
              orderId: true,
              harga: true
            },
            orderBy: {
              harga: 'desc'
            }
          }),
          
          // Most expensive today
          ctx.prisma.pembayaran.findMany({
            where: {
              createdAt: {
                gte: startOfDay
              }
            },
            take: 10,
            select: {
              orderId: true,
                    harga: true
            },
            orderBy: {
              harga: 'desc'
            }
          }),
          
          // Most expensive this week
          ctx.prisma.pembayaran.findMany({
            where: {
              createdAt: {
                gte: startOfWeek
              }
            },
            take: 10,
            select: {
              orderId: true,
              noPembeli: true,
              status: true,
              updatedAt: true,
              harga: true
            },
            orderBy: {
              harga: 'desc'
            }
          }),
          
          // Most expensive this month
          ctx.prisma.pembayaran.findMany({
            where: {
              createdAt: {
                gte: startOfMonth
              }
            },
            take: 10,
            select: {
              orderId: true,
              noPembeli: true,
              status: true,
              updatedAt: true,
              harga: true
            },
            orderBy: {
              harga: 'desc'
            }
          }),
        ]);
        
        // Return all data in a structured object
        return {
          expensive: {
            today: expensiveToday,
            week: expensiveWeek,
            month: expensiveMonth
          }
        };
      })
  });



import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { getProfile } from '@/app/(auth)/auth/components/server';

export const Deposits = router({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        perPage: z.number().default(10),
        search: z.string().optional().default(''),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.DepositsWhereInput = {};
        const take = input.perPage;
        const skip = (input.page - 1) * take;

        if (input.search) {
          where.username = {
            contains: input.search,
          };
        }

        const totalCount = await ctx.prisma.deposits.count({
          where,
        });

        const totalPages = Math.ceil(totalCount / take);
        const hasNextPage = input.page < totalPages;
        const hasPreviousPage = input.page > 1;

        const data = await ctx.prisma.deposits.findMany({
          where,
          take,
          skip,
          orderBy: {
            createdAt: 'desc',
          },
        });

        return {
          data,
          pagination: {
            totalCount,
            totalPages,
            currentPage: input.page,
            hasNextPage,
            hasPreviousPage,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error('error : ', error.message);
        }
        throw new Error(`Internal Server Erorr`);
      }
    }),
    getByUsername: publicProcedure.query(async ({ ctx }) => {
      try {
        const session = await getProfile()
        if (!session) {
          return {
            status: false,
            message: 'Unauthorized',
            statusCode: 401,
            data: null
          };
        }
        const user = await  ctx.prisma.users.findUnique({
          where : {
            id : session.session.id
          }
        })

        
        const data = await ctx.prisma.deposits.findMany({
          where: {
            username: session?.session.username,
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return {
          status: true,
          message: 'Success',
          statusCode: 200,
          data: {
            history: data,
            user
          }
        };
      } catch (error) {
        console.error('Error in getByUsername:', error);
        
        if (error instanceof TRPCError) {
          return {
            status: false,
            message: error.message,
            statusCode: 400,
            data: null
          };
        }
        
        return {
          status: false,
          message: 'Internal Server Error',
          statusCode: 500,
          data: null
        };
      }
    }),
});

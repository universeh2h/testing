import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';

export const methods = router({
  getMethods: publicProcedure
    .input(
      z
        .object({
          code: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.MethodWhereInput = {};

        if (input?.code) {
          where.code = input.code;
        }
        const method = await ctx.prisma.method.findMany({
          where: { code: input?.code },
        });
        return {
          data: method,
          status: 200,
          message: 'Methods delivered success',
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        throw new Error('failed to fetch methods');
      }
    }),
});

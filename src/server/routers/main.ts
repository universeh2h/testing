import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { FormCategory } from '@/types/schema/categories';
export const mainRouter = router({
  getBanners: publicProcedure.query(async ({ ctx }) => {
    try {
      const banners = await ctx.prisma.berita.findMany();
      const layananFlashsale = await ctx.prisma.layanan.findMany({
        where : {
          isFlashSale : true
        },
        select :{
          hargaFlashSale : true,
          judulFlashSale : true,
          layanan : true,
          bannerFlashSale : true,
          expiredFlashSale : true,
        },
        orderBy : {
          expiredFlashSale : 'desc'
        }
      })
      return {
        statusCode: 200,
        message: 'Banners fetched successfully',
        data: {
          banners,
          flashSale : layananFlashsale
        },
      };
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw new Error('Failed to fetch banners');
    }
  }),
  createCategory: publicProcedure
    .input(FormCategory)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.categories.create({
        data: {
          ...input,
        },
      });

      return {
        message: 'success',
        status: true,
        data: category,
      };
    }),

  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: FormCategory.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.categories.update({
        where: { id: input.id },
        data: input.data,
      });

      return {
        message: 'success',
        status: true,
        data: category,
      };
    }),

  deleteCategory: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.categories.delete({
        where: { id: input.id },
      });

      return {
        message: 'success',
        status: true,
      };
    }),
  getCategoriesByName: publicProcedure
    .input(
      z.object({
        kode: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const categories = await ctx.prisma.categories.findFirst({
          where: {
            kode: input.kode,
            status: 'active',
          },
        });

        const subCategories = await ctx.prisma.subCategory.findMany({
          where: {
            categoryId: categories?.id,
          },
        });

        return { categories, subCategories };
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        throw new Error('Failed to fetch  categories');
      }
    }),
  getCategoriesType: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.categories.findMany({
        select: {
          tipe: true,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new Error('Failed to fetch  categories');
    }
  }),
  getCategoriesActive: publicProcedure
    .input(
      z.object({
        type: z.string(),
        page: z.string().transform((val) => parseInt(val, 10) || 1),
        perPage: z.string().transform((val) => parseInt(val, 10) || 10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.perPage;

        // Get paginated data
        const categories = await ctx.prisma.categories.findMany({
          where: { tipe: input.type, status: 'active' },
          skip,
          take: input.perPage,
          orderBy: { id: 'asc' },
        });

        const totalCount = await ctx.prisma.categories.count({
          where: { tipe: input.type },
        });

        const totalPages = Math.ceil(totalCount / input.perPage);

        return {
          data: categories,
          meta: {
            currentPage: input.page,
            perPage: input.perPage,
            totalCount,
            totalPages,
            hasNextPage: input.page < totalPages,
            hasPreviousPage: input.page > 1,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        throw new Error('Failed to fetch active categories');
      }
    }),
  getCategoriesAll: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        status: z.string().optional(),
        page: z.number().optional(),
        perPage: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { perPage = 10, page = 1, type, status, search } = input;

      // Simplified pagination calculation
      const take = perPage;
      const skip = (page - 1) * take;

      // Build dynamic where clause
      const where: Prisma.CategoriesWhereInput = {};

      // Add type filter if provided
      if (type) {
        where.tipe = type;
      }

      // Add status filter if provided
      if (status) {
        where.status = status;
      }

      // Add search filter if provided
      if (search) {
        where.OR = [
          { nama: { contains: search } },
          { subNama: { contains: search } },
          { brand: { contains: search } },
          { kode: { contains: search } },
        ];
      }

      try {
        // Get categories with pagination and filters
        const [categories, totalCount] = await Promise.all([
          ctx.prisma.categories.findMany({
            where,
            take,
            skip,
            orderBy: {
              createdAt: 'desc',
            },
          }),
          ctx.prisma.categories.count({ where }),
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / take);

        return {
          data: categories,
          pagination: {
            page,
            perPage,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        throw new Error('Failed to fetch categories');
      }
    }),
  getCategoriesPopular: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.prisma.categories.findMany({
        where: {
          tipe: 'populer',
          status: 'active',
        },
      });
      return categories;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new Error('failed to fetch categories popular');
    }
  }),
  getCategories: publicProcedure
    .input(
      z
        .object({
          fields: z.array(z.string()).optional(), // Optional array of fields to select
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        // Determine which fields to select
        const selectedFields = input?.fields?.length
          ? input.fields.reduce((acc, field) => {
              acc[field] = true;
              return acc;
            }, {} as Record<string, boolean>)
          : undefined;

        // Fetch categories with conditional selection
        const categories = await ctx.prisma.categories.findMany({
          select: selectedFields || undefined, // Use selected fields or fetch all
        });

        return {
          statusCode: 200,
          message: 'Categories fetched successfully',
          data: categories,
        };
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
      }
    }),
});

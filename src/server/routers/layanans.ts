/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';
import { layananFormSchema } from '@/types/layanans';

export const Layanans = router({
  getLayanans: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        page: z.string().transform((val) => parseInt(val, 10) || 1),
        perPage: z.string().transform((val) => parseInt(val, 10) || 10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.perPage;

        const where: Prisma.LayananWhereInput = {};

        // Add search filter
        if (input.search) {
          where.layanan = {
            contains: input.search,
          };
        }

        // Add status filter
        if (input.status) {
          where.status = input.status === 'active' ? true : false;
        }

        // Execute query with filters
        const data = await ctx.prisma.layanan.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: {
            layanan: 'asc', // Default ordering
          },
          select: {
            id: true,
            layanan: true,
            harga: true,
            status: true,
          },
        });

        // Get total count for pagination info (optional)
        const totalCount = await ctx.prisma.layanan.count({ where });

        return {
          data,
          pagination: {
            total: totalCount,
            page: input.page,
            perPage: input.perPage,
            pageCount: Math.ceil(totalCount / input.perPage),
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error('error : ', error.message);
        }
        console.error('error fetching layanans');
        return {
          data: [],
          pagination: {
            total: 0,
            page: input.page,
            perPage: input.perPage,
            pageCount: 0,
          },
        };
      }
    }),
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        subCategoryId: z.number().optional(),
        providerId: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        isFlashSale: z.boolean().optional(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const skip = (input.page - 1) * input.perPage;

        const where: Prisma.LayananWhereInput = {};

        // Add search filter
        if (input.search) {
          where.layanan = {
            contains: input.search,
          };
        }

        // Add category filter
        if (input.categoryId) {
          where.kategoriId = parseInt(input.categoryId)
        }

        // Add subcategory filter
        if (input.subCategoryId) {
          where.subCategoryId = input.subCategoryId;
        }

        // Add provider filter
        if (input.providerId) {
          where.providerId = input.providerId;
        }

        // Add status filter
        if (input.status !== undefined) {
          where.status = input.status ? true : false;
        }

        // Add flash sale filter
        if (input.isFlashSale !== undefined) {
          where.isFlashSale = input.isFlashSale;
        }

        // Execute query with filters
        const data = await ctx.prisma.layanan.findMany({
          where,
          skip,
          take: input.perPage,
          orderBy: {
            layanan: 'asc', // Default ordering
          },
          // No include section since relationships don't exist
        });

        // Get total count for pagination info
        const totalCount = await ctx.prisma.layanan.count({ where });

        const transformedData = await Promise.all(
          data.map(async (item) => {
            const category = await ctx.prisma.categories.findUnique({
              where: { id: item.kategoriId },
              select: { id: true,nama: true },
            });

            const subCategory = await ctx.prisma.subCategory.findUnique({
              where: { id: item.subCategoryId },
              select: { id: true, name: true },
            });

            return {
              ...item,
              name: item.layanan,
              price: item.harga,
              isActive: item.status,
              category: category || {
                id: item.kategoriId ,
                nama: `Kategori ${item.kategoriId}`, // Fallback if category not found
              },
              subCategory: subCategory || {
                id: item.subCategoryId,
                name: `Sub Kategori ${item.subCategoryId}`, // Fallback if subcategory not found
              },
            };
          })
        );

        // Calculate pagination information
        const totalPages = Math.ceil(totalCount / input.perPage);
        const hasNextPage = input.page < totalPages;
        const hasPreviousPage = input.page > 1;

        return {
          data: transformedData,
          pagination: {
            totalCount,
            totalPages,
            currentPage: input.page,
            hasNextPage,
            hasPreviousPage,
          },
        };
      } catch (error) {
        return {
          data: [],
          pagination: {
            totalCount: 0,
            currentPage: input.page,
            perPage: input.perPage,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
    }),
  getLayananByCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.categories.findFirst({
          where: { kode: input.category },
        });
        const subCategories = await ctx.prisma.subCategory.findMany({
          where: {
            categoryId: category?.id,
          },
        });
        const data = await ctx.prisma.layanan.findMany({
          where: {
            kategoriId: category?.id,
          },
          select: {
            layanan: true,
            providerId: true,
            subCategoryId: true,
            harga: true,
            hargaFlashSale : true,
            isFlashSale : true,
            id: true,
          },
          orderBy: {
            harga: 'asc',
          },
        });
        return {
          layanan: data,
          subCategories,
        };
      } catch (error) {
        return {
         status : false,
         layanan : [],
         subCategories : []
        };
      }
    }),
  getLayananByCategoryId: publicProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.categories.findFirst({
          where: { id: parseInt(input.category) },
        });

        if (!category) {
          throw new Error('failed to create category');
        }

        const data = await ctx.prisma.layanan.findMany({
          where: {
            kategoriId: category?.id,
          },
          select: {
            layanan: true,
            providerId: true,
            subCategoryId: true,
            harga: true,
            id: true,
          },
          orderBy: {
            harga: 'asc',
          },
        });
        return {
          layanan: data,
        };
      } catch (error) {
        return {
          error,
          status: false,
        };
      }
    }),
  edit: publicProcedure
    .input(layananFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.layanan.update({
          where: {
            id: input.id as number,
          },
          data: {
            ...input,
            status: input.status ? true : false,
          },
        });

        return {
          status: true,
          message: 'layanan update successfully',
        };
      } catch (error) {
        return {
          error,
          status: false,
        };
      }
    }),
  flashsale: publicProcedure.query(async ({ ctx }) => {
    try {
      // First, fetch all flash sale items
      const layananItems = await ctx.prisma.layanan.findMany({
        where: {
          isFlashSale: true,
        },
      });

      // Get all the unique kategoriId values
      const categoryIds = Array.from(
        new Set(layananItems.map((item) => item.kategoriId))
      );

      // Fetch all related categories in one query
      const categories = await ctx.prisma.categories.findMany({
        where: {
          // Use 'in' operator to fetch multiple categories at once
          id: {
            in: categoryIds.map((id) => id),
          },
        },
      });

      const categoryMap = categories.reduce<
        Record<string, (typeof categories)[0]>
      >((acc, category) => {
        acc[category.id.toString()] = category;
        return acc;
      }, {});

      // Combine layanan items with their categories
      const data = layananItems.map((layanan) => ({
        ...layanan,
        category: categoryMap[layanan.kategoriId] || null,
      }));

      return data;
    } catch (error) {
      return {
        error,
        status: false,
      };
    }
  }),
});

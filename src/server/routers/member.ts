import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { Prisma } from "@prisma/client";
import { findUserById, findUserByUsername, getProfile } from "@/app/(auth)/auth/components/server";

export const member = router({
  findAll: publicProcedure.input(
    z.object({
      page: z.number(),
      perPage: z.number(),
      filter: z.string().optional()
    }),
  ).query(async ({ ctx, input }) => {
    try {
      const where: Prisma.UsersWhereInput = {}
      
      if (input.filter) {
        where.username  = input.filter
      }
      
      const skip = (input.page - 1) * input.perPage;
      const take = input.perPage;
      
      const [data, total] = await Promise.all([
        ctx.prisma.users.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        ctx.prisma.users.count({ where })
      ]);
      
      return {
        data,
        meta: {
          total,
          page: input.page,
          perPage: input.perPage,
          pageCount: Math.ceil(total / input.perPage)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),
  findMe : publicProcedure.query(async({ctx}) => {
    try {
     const session = await getProfile()

     if(!session){
      return  {
        status : false,
        message : "Message retreived successfully"
      }
     }
     const profile  = await ctx.prisma.users.findUnique({
      where : {
        username : session.session?.username
      },
      select : {
        role : true,
        id : true,
        balance : true,
        name : true,
        username : true
      }
     }) 

     if(!profile){
      return  {
        status : false,
        message : "Message retreived successfully"
      }
     }

     return profile
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error instanceof Error ? error.message : 'Unknown error'}`);

    }
  }),
  add: publicProcedure.input(
    z.object({
      username: z.string(),
      name: z.string(),
      password: z.string()
    })
  ).mutation(async ({ctx, input}) => {
    try {
      const validate = await findUserByUsername(input.username)
      
      if (validate) {
        throw new Error("Username Telah Terpakai")
      }
      
      const create = await ctx.prisma.users.create({
        data: {
          ...input,
          role: 'Member',
          balance: 0 
        }
      })
      
      if(!create) {
        throw new Error("Failed to create user")
      }
      
      return {
        data: create,
        message: "Create user successfully",
        status: true
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed Create User")
    }
  }),
  deleteUser : publicProcedure.input(
    z.object({
        userId : z.number()
    })
  ).mutation(async ({ctx,input})  => {
    try {
        const user =  await findUserById(input.userId)

        if(!user){
            return {
                status : false,
                message : 'user not found'
            }
        }
        const userdelete = await ctx.prisma.users.delete({
            where : {
                id : input.userId
            }
        })   

        if(!userdelete)  {
            return {
                 status : false,
                message : 'failed to delete Users'
            }
        }
        return {
            status : false,
            message : "delete user successfully",
            data : userdelete
        }
    } catch (error) {
        return {
            status : false,
            message : "internal Server Erorr"
        }
    }
  }),


});
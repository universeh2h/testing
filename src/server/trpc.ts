import { initTRPC } from '@trpc/server';
import { prisma } from '@/lib/prisma';
export async function createContext() {
  return {
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// src/utils/trpc.ts
import { AppRouter } from '@/server/routers/_app';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

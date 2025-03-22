import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

const handler = NextAuth({
     adapter: PrismaAdapter(prisma),
      session: { strategy: "jwt" },
      ...authConfig,
});

export { handler as GET, handler as POST };
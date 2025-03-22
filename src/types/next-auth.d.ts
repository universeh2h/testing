import "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      username? : string
    } & DefaultSession["user"]
  }

  interface User {
    id: number;
    role?: string;
    username? : string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    role?: string;
    username? : string
  }
}
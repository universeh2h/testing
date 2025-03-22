// auth.config.ts
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/types/schema/auth';
import bcryptjs from 'bcryptjs';
import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthOptions = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedCredentials = loginSchema.parse(credentials);
          
          if (validatedCredentials) {
            const { username, password } = validatedCredentials;
            
            const user = await prisma.users.findUnique({
              where: { username },
            });
            
            if (!user || !user.password) {
              return null;
            }
            
            const validPassword = await bcryptjs.compare(password, user.password);
            
            if (validPassword) {
              return {
                id: user.id,
                username: user.username,
                role: user.role,
              };
            }
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = parseInt(user.id as string);
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) session.user.role = token.role as string;
      if (token.id) session.user.id = token.id as number; // Use as number
      if (token.username) session.user.username = token.username as string;
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret : process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

export default authConfig;
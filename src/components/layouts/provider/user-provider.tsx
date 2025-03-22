'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { Navbar } from '../navbar';
import { User } from '@/types/schema/user';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { findUserById } from '@/app/(auth)/auth/components/server';

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function UserGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const userData = await findUserById(session.user.id as number);
          if (userData) {
            setUser(userData as User);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  if (status === 'loading' || loading) {
    return <LoadingOverlay />;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // checking user role
  if (session?.user.role !== 'Member') {
    redirect('/');
  }

  return (
    <>
      <Navbar user={user as User} />
      {children}
    </>
  );
}

'use client';

import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { SessionProvider, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

// This component provides the SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// This component handles admin authentication
export function AdminProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <LoadingOverlay />;
  }
  
  if (status === 'unauthenticated') {
    redirect('/login');
  }
  
  // checking user role
  if (session?.user.role !== 'Admin') {
    redirect('/');
  }
  
  // Don't wrap with AuthProvider here
  return <>{children}</>;
}
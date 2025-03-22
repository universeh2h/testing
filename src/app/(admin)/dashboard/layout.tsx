import { AdminProvider, AuthProvider } from '@/components/layouts/provider/admin-provider';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { User } from '@/types/schema/user';
import { NavbarAdmin } from '@/components/layouts/navbar-admin';
import { findUserById, getProfile } from '../../(auth)/auth/components/server';

export default async function Page({ children }: { children: ReactNode }) {
  const session = await getProfile();
  const user = await findUserById(session?.session.id as number);
  return (
    <AuthProvider>
      <AdminProvider>
        <NavbarAdmin user={user as User}>{children}</NavbarAdmin>
      </AdminProvider>
    </AuthProvider>
  );
}

import { User } from '@/types/schema/user';

import { Navbar } from '@/components/layouts/navbar';
import { ReactNode } from 'react';
import { Footer } from '@/components/layouts/footer';
import { findUserById, getProfile } from '../(auth)/auth/components/server';

export default async function LayoutMainPage({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getProfile();
  let user: User | null = null;

  if (session?.session.id) {
    user = await findUserById(session.session.id as number);
  }
  return (
    <div className="flex min-h-screen  flex-col ">
      <Navbar user={user as User} />
      {children}
      <Footer />
    </div>
  );
}

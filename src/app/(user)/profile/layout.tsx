import {
  AuthProvider,
  UserGuard,
} from '@/components/layouts/provider/user-provider';
import { ReactNode } from 'react';

export default function Page({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserGuard>{children}</UserGuard>
    </AuthProvider>
  );
}

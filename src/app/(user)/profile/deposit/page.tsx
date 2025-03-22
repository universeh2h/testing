import { UserTopUp } from '@/features/pages/member/deposite/user-topup';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Deposit',
  description: 'Deposit User',
};
export default function Page() {
  return <UserTopUp />;
}

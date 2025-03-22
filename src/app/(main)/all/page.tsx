import AllGamePage from '@/features/pages/all-game/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All-Game',
  description: 'All Game Di Vazzuniverse Tempat Top-up Terpecaya ',
};

export default function Page() {
  return <AllGamePage />;
}

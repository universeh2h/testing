import { DaftarHargaPage } from '@/features/pages/daftar-harga/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price-list',
  description: 'Price-list Vazzuniverse Top-up Murah dan Terpercaya ',
};
export default function Page() {
  return <DaftarHargaPage />;
}

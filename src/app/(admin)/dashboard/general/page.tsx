import { GeneralPage } from '@/features/pages/general/main';
import { Metadata } from 'next';


export const metadata :Metadata  = {
  title : "General",
  description : "Dashboard "
}
export default function Page() {
  return <GeneralPage />;
}

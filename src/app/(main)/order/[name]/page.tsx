import { JSX } from 'react';
import { OrderMainPage } from '@/features/pages/order/main';
import { Metadata } from 'next';

export  const metadata : Metadata = {
  title : "Order - Vazzuniverse",
  description  : 'Order Vazzuniverse adalah sebuah penyedia layanan top up games dengan harga termurah dan proses super instan. Dapatkan lebih banyak promo dan potongan harga dengan cara bergabung menjadi Reseller.'
}


export default  function Page() :JSX.Element {
  return (
    <>
      <OrderMainPage />
    </>
  );
}

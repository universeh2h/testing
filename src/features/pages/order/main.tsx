'use client';
import { useParams } from 'next/navigation';
import DetailsCategories from './details-categories';
import { useEffect } from 'react';
import { usePlansStore } from '@/hooks/use-select-plan';

export function OrderMainPage() {
  const { name } = useParams();

  useEffect(() => {
    usePlansStore.setState(
      {
        selectPlans: null,
        userID: null,
        serverID: null,
        categories: null,
        voucher: '',
        noWa: null,
        selectPayment: null,
      },
      false
    );
  }, [name]);

  return (
    <>
      <DetailsCategories name={name as string} />
    </>
  );
}

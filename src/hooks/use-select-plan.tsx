'use client';

import { Category, PlansProps } from '@/types/category';
import { create } from 'zustand';

export enum STEPORDER {
  plans = 1,
  wa = 2,
  payment = 3,
}

export type Method = {
  code: string;
  price: number;
  name: string;
  type: string;
};

export type TypePlansStore = {
  selectPlans: PlansProps | null;
  userID: string | null;
  serverID: string | null;
  voucher: string;
  setVoucher: (voucher: string) => void;
  categories: Category | null;
  setCategories: (cat: Category | null) => void;
  setUserId: (userid: string | null) => void;
  setServerId: (serverId: string | null) => void;
  setSelectPlans: (plans: PlansProps | null) => void;
  noWa: null | string;
  setNowa: (wa: string) => void;
  selectPayment: null | Method;
  setSelectPayment: (method: Method | null) => void;
  reset: () => void;
};

export const usePlansStore = create<TypePlansStore>((set) => ({
  selectPlans: null,
  userID: null,
  serverID: null,
  categories: null,
  voucher: '',
  setVoucher: (voucher: string) => set({ voucher }),
  setCategories: (cat: Category | null) => set({ categories: cat }),
  setUserId: (userid: string | null) => set({ userID: userid }),
  setServerId: (serverId: string | null) => set({ serverID: serverId }),
  setSelectPlans: (plans: PlansProps | null) => set({ selectPlans: plans }),
  noWa: null,
  setNowa: (wa: string) => set({ noWa: wa }),
  selectPayment: null,
  reset: () =>
    set({
      selectPlans: null,
      selectPayment: null,
      noWa: '',
      voucher: '',
      userID: null,
      serverID: null,
      categories: null,
      setCategories: () => set({ categories: null }),
      setUserId: () => set({ userID: null }),
      setServerId: () => set({ serverID: null }),
      setVoucher: () => set({ voucher: '' }),
      setSelectPayment: () => set({ selectPayment: null }),
      setSelectPlans: () => set({ selectPlans: null }),
      setNowa: () => set({ noWa: null }),
    }),
  setSelectPayment: (payment: Method | null) => set({ selectPayment: payment }),
}));

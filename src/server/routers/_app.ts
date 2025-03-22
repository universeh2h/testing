import { router } from '../trpc';
import { ConfigWeb } from './config';
import { Deposits } from './deposits';
import { Layanans } from './layanans';
import { mainRouter } from './main';
import { member } from './member';
import { methods } from './method';
import { order } from './order';
import { subCategory } from './sub-category';
import { adminStats, PembelianAll } from './transaction';
// import { transaction } from './transaction';
import { voucher } from './voucher';

export const appRouter = router({
  main: mainRouter,
  methods: methods,
  layanans: Layanans,
  sub: subCategory,
  transaction : adminStats,
  order: order,
  voucher: voucher,
  deposits: Deposits,
  setting: ConfigWeb,
  pembelian  : PembelianAll,
  member : member
});

export type AppRouter = typeof appRouter;

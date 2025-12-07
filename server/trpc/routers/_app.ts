import { createTRPCRouter } from '../init';
import { customPcRouter } from './customPc.router';
import { productRouter } from './product.route';
import { transactionRouter } from './transaction.route';

export const appRouter = createTRPCRouter({
  product: productRouter,
  transaction: transactionRouter,
  customPc: customPcRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

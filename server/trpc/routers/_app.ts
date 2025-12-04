import { createTRPCRouter } from '../init';
import { productRouter } from './product.route';
import { transactionRouter } from './transaction.route';

export const appRouter = createTRPCRouter({
  product: productRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

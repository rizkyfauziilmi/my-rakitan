import { createTRPCRouter } from '../init';
import { productRouter } from './product.route';

export const appRouter = createTRPCRouter({
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

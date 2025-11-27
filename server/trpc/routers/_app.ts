import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../init';
import { productRouter } from './product.route';

export const appRouter = createTRPCRouter({
  productRouter: productRouter,
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

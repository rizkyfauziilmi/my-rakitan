import { adminProcedure, createTRPCRouter, publicProcedure } from '../init';
import { productsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from '../schema/product.schema';

export const productRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.query.productsTable.findMany();
    return products;
  }),
  getByCategory: publicProcedure
    .input(
      createProductSchema.pick({
        category: true,
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db
        .select()
        .from(productsTable)
        .where(eq(productsTable.category, input.category));
      return products;
    }),
  getByType: publicProcedure
    .input(
      createProductSchema.pick({
        type: true,
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db
        .select()
        .from(productsTable)
        .where(eq(productsTable.type, input.type));
      return products;
    }),
  createProduct: adminProcedure.input(createProductSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(productsTable).values(input);

    return {
      message: 'Produk berhasil dibuat',
    };
  }),
  updateProduct: adminProcedure.input(updateProductSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    const existingProduct = await ctx.db.query.productsTable.findFirst({
      where: eq(productsTable.id, id),
    });

    if (!existingProduct) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Produk tidak ditemukan',
      });
    }

    await ctx.db.update(productsTable).set(updateData).where(eq(productsTable.id, id));

    return {
      message: 'Produk berhasil diperbarui',
    };
  }),
  deleteProduct: adminProcedure.input(deleteProductSchema).mutation(async ({ ctx, input }) => {
    const { id } = input;

    const existingProduct = await ctx.db.query.productsTable.findFirst({
      where: eq(productsTable.id, id),
    });

    if (!existingProduct) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Produk tidak ditemukan',
      });
    }

    await ctx.db.delete(productsTable).where(eq(productsTable.id, id));

    return {
      message: 'Produk berhasil dihapus',
    };
  }),
});

import { adminProcedure, createTRPCRouter, publicProcedure } from '../init';
import { categoryProductENUM, productENUM, productsTable } from '@/server/db/schema';
import { and, asc, desc, eq, ilike } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from '../schema/product.schema';
import z from 'zod';
import { withCursorPagination } from 'drizzle-pagination';

const limitProduct = z.number().min(1).max(100).optional();
const isPopularProduct = z.boolean().default(false).optional();

export const productRouter = createTRPCRouter({
  getSearchProduct: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        type: z.enum(productENUM.enumValues, 'Tipe produk tidak valid').optional(),
        category: z.enum(categoryProductENUM.enumValues, 'Kategori produk tidak valid').optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(50).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, query, type, category } = input;

      const data = await ctx.db.query.productsTable.findMany(
        withCursorPagination({
          where: and(
            type ? eq(productsTable.type, type) : undefined,
            category ? eq(productsTable.category, category) : undefined,
            query ? ilike(productsTable.name, `%${query}%`) : undefined
          ),
          limit,
          cursors: [[productsTable.id, 'asc', cursor ? cursor : undefined]],
        })
      );

      return {
        data,
        nextCursor: data.length ? data[data.length - 1].id : null,
      };
    }),

  getAllProducts: publicProcedure
    .input(
      z.object({
        limit: limitProduct,
        isPopular: isPopularProduct,
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.query.productsTable.findMany({
        limit: input.limit,
        orderBy: input.isPopular ? [desc(productsTable.sold)] : [asc(productsTable.sold)],
      });

      return products;
    }),
  getProductById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.productsTable.findFirst({
        where: eq(productsTable.id, input.id),
      });

      return product;
    }),

  /**
   * validateCartStock
   *
   * Accepts an array of items { id, quantity } and checks current DB stock for each.
   * Returns an object { valid: boolean, mismatches: Array<{ id, requested, available, name? }> }
   * so the client (React Query / TRPC consumer) can show appropriate feedback or adjust quantities.
   */
  validateCartStock: publicProcedure
    .input(
      z.object({
        items: z
          .array(
            z.object({
              id: z.string(),
              quantity: z.number().min(1),
            })
          )
          .min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      // For each requested item, fetch the current stock and compare.
      const checks = await Promise.all(
        input.items.map(async (it) => {
          const p = await ctx.db.query.productsTable.findFirst({
            columns: { id: true, stock: true, name: true },
            where: eq(productsTable.id, it.id),
          });

          return {
            id: it.id,
            requested: it.quantity,
            available: p ? p.stock : 0,
            exists: !!p,
            name: p?.name,
          };
        })
      );

      const mismatches = checks
        .filter((c) => !c.exists || c.requested > c.available)
        .map((c) => ({
          id: c.id,
          requested: c.requested,
          available: c.available,
          name: c.name,
        }));

      return {
        valid: mismatches.length === 0,
        mismatches,
      };
    }),
  getByCategory: publicProcedure
    .input(
      createProductSchema
        .pick({
          category: true,
        })
        .extend({
          limit: limitProduct,
          isPopular: isPopularProduct,
        })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db
        .select()
        .from(productsTable)
        .limit(input.limit ? input.limit : 0)
        .where(eq(productsTable.category, input.category))
        .orderBy(input.isPopular ? desc(productsTable.sold) : asc(productsTable.sold));

      return products;
    }),
  getByType: publicProcedure
    .input(
      createProductSchema
        .pick({
          type: true,
        })
        .extend({
          limit: limitProduct,
          isPopular: isPopularProduct,
        })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db
        .select()
        .from(productsTable)
        .limit(input.limit ? input.limit : 0)
        .where(eq(productsTable.type, input.type))
        .orderBy(input.isPopular ? desc(productsTable.sold) : asc(productsTable.sold));

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

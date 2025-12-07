import { createTRPCRouter, userProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

import {
  customPcTable,
  customPcItemTable,
  productsTable,
  transactionsTable,
  transactionItem,
} from '@/server/db/schema';
import { createCustomPcSchema } from '../schema/custompc.schema';
import z from 'zod';

export const customPcRouter = createTRPCRouter({
  createCustomPc: userProcedure.input(createCustomPcSchema).mutation(async ({ ctx, input }) => {
    let totalPrice = 0;
    const itemsDetails = [];

    for (const item of input.items) {
      const [product] = await ctx.db
        .select({
          id: productsTable.id,
          price: productsTable.price,
        })
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Product with ID ${item.productId} not found`,
        });
      }

      // push item details for later use
      itemsDetails.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      const itemTotalPrice = product.price * item.quantity;
      totalPrice += itemTotalPrice;
    }

    // Create the custom PC entry
    const [pc] = await ctx.db
      .insert(customPcTable)
      .values({
        name: input.name,
        userId: ctx.session.user.id,
        totalPrice: totalPrice,
      })
      .returning();

    // Insert the custom PC items
    for (const itemDetail of itemsDetails) {
      await ctx.db.insert(customPcItemTable).values({
        customPcId: pc.id,
        productId: itemDetail.productId,
        quantity: itemDetail.quantity,
        price: itemDetail.price,
      });
    }

    return {
      data: pc,
      message:
        'Custom PC berhasil dibuat, lanjutkan ke pembayaran untuk menyelesaikan pesanan Anda.',
    };
  }),
  getCustomPcCart: userProcedure.query(async ({ ctx }) => {
    const pcs = await ctx.db.query.customPcTable.findMany({
      where: eq(customPcTable.userId, ctx.session.user.id),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        transaction: {
          columns: {
            id: true,
            status: true,
          },
        },
      },
    });

    // only get belum dibayar pcs
    const pcsFiltered = pcs.filter((pc) => {
      return pc.transaction.status === 'belum_dibayar';
    });

    return pcsFiltered;
  }),
  deleteCustomPc: userProcedure
    .input(
      z.object({
        id: z.uuid('Custom PC ID tidak valid'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if pc exists
      const pc = await ctx.db.query.customPcTable.findFirst({
        where: eq(customPcTable.id, input.id),
      });

      if (!pc) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Custom PC dengan ID ${input.id} tidak ditemukan.`,
        });
      }

      // delete related transaction
      await ctx.db.delete(transactionsTable).where(eq(transactionsTable.customPcId, input.id));

      // delete related custom pc items
      await ctx.db.delete(transactionItem).where(eq(transactionItem.id, input.id));

      // delete pc items first
      await ctx.db.delete(customPcItemTable).where(eq(customPcItemTable.customPcId, input.id));

      // delete the pc
      await ctx.db.delete(customPcTable).where(eq(customPcTable.id, input.id));

      return {
        message: 'Custom PC berhasil dihapus dari keranjang.',
      };
    }),
});

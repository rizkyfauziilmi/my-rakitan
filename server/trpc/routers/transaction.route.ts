import { createTRPCRouter, userProcedure, adminProcedure } from '../init';
import { and, eq, sql } from 'drizzle-orm';
import {
  transactionItem,
  transactionsTable,
  productsTable,
  customPcTable,
} from '@/server/db/schema';
import { TRPCError } from '@trpc/server';
import {
  changeResiSchema,
  createTransactionSchema,
  markTransactionAsShippedSchema,
  transactionIdSchema,
} from '../schema/transaction.schema';

export const transactionRouter = createTRPCRouter({
  createTransaction: userProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      let items = input.items;

      // --------------------------------------------------
      // CASE 1: TRANSAKSI DARI CUSTOM PC
      // --------------------------------------------------
      if (input.customPcId) {
        // ambil build + items
        const pc = await ctx.db.query.customPcTable.findFirst({
          where: eq(customPcTable.id, input.customPcId),
          with: { items: true },
        });

        if (!pc)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Custom PC tidak ditemukan',
          });

        if (pc.userId !== ctx.session.user.id)
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Anda tidak memiliki akses ke custom PC ini',
          });

        // mapping item custom pc ke format transactionItem
        items = pc.items.map((i) => ({
          productId: i.productId,
          qty: i.quantity,
          price: i.price,
        }));
      }

      if (!items || items.length === 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tidak ada item dalam transaksi',
        });

      // --------------------------------------------------
      // HITUNG TOTAL
      // --------------------------------------------------
      const totalPrice = items.reduce((acc, i) => acc + i.qty * i.price, 0);

      // --------------------------------------------------
      // BUAT TRANSAKSI
      // --------------------------------------------------
      const [trx] = await ctx.db
        .insert(transactionsTable)
        .values({
          userId: ctx.session.user.id,
          totalPrice,
          status: 'belum_dibayar',
          address: input.address,
          customPcId: input.customPcId ?? null,
        })
        .returning();

      // --------------------------------------------------
      // MASUKKAN ITEM KE TRANSACTION_ITEM
      // --------------------------------------------------
      for (const item of items) {
        await ctx.db.insert(transactionItem).values({
          transactionId: trx.id,
          productId: item.productId,
          quantity: item.qty,
          price: item.price,
        });
      }

      return {
        message: 'Transaksi berhasil dibuat, selesaikan pembayaran untuk melanjutkan',
        data: trx,
      };
    }),

  simulateTransactionPayment: userProcedure
    .input(transactionIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { transactionId } = input;

      const [trx] = await ctx.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, transactionId));

      if (!trx)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaksi tidak ditemukan',
        });
      if (trx.userId !== ctx.session.user.id)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Anda tidak memiliki akses ke transaksi ini',
        });
      if (trx.status !== 'belum_dibayar')
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Transaksi tidak bisa dibayar (status: ${trx.status})`,
        });

      const items = await ctx.db
        .select()
        .from(transactionItem)
        .where(eq(transactionItem.transactionId, transactionId));

      // check stock and update stock and sold
      // if any product stock is less than item quantity, throw error
      for (const item of items) {
        const [product] = await ctx.db
          .select({
            name: productsTable.name,
            stock: productsTable.stock,
          })
          .from(productsTable)
          .where(eq(productsTable.id, item.productId));

        if (!product)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Produk dengan ID ${item.productId} tidak ditemukan`,
          });

        if (product.stock < item.quantity)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Stok produk ${product.name} tidak mencukupi`,
          });
      }

      // update stock and sold
      for (const item of items) {
        await ctx.db
          .update(productsTable)
          .set({
            stock: sql`${productsTable.stock} - ${item.quantity}`,
            sold: sql`${productsTable.sold} + ${item.quantity}`,
          })
          .where(eq(productsTable.id, item.productId));
      }

      const [updated] = await ctx.db
        .update(transactionsTable)
        .set({
          status: 'dikemas',
        })
        .where(eq(transactionsTable.id, transactionId))
        .returning();

      return {
        message: 'Pembayaran berhasil, pesanan sedang dikemas',
        data: updated,
      };
    }),
  cancelTransaction: userProcedure.input(transactionIdSchema).mutation(async ({ ctx, input }) => {
    const { transactionId } = input;

    // Ambil transaksi
    const [trx] = await ctx.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, transactionId));

    if (!trx) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Transaksi tidak ditemukan',
      });
    }

    // Cek pemilik transaksi
    if (trx.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Anda tidak memiliki akses ke transaksi ini',
      });
    }

    // Hanya bisa membatalkan jika belum dibayar
    if (trx.status !== 'belum_dibayar') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Transaksi tidak dapat dibatalkan (status: ${trx.status})`,
      });
    }

    // Update menjadi dibatalkan
    const [updated] = await ctx.db
      .update(transactionsTable)
      .set({
        status: 'dibatalkan',
      })
      .where(eq(transactionsTable.id, transactionId))
      .returning();

    return {
      message: 'Pesanan berhasil dibatalkan',
      transaction: updated,
    };
  }),
  markAsShipped: adminProcedure
    .input(markTransactionAsShippedSchema)
    .mutation(async ({ ctx, input }) => {
      const { transactionId } = input;

      const [trx] = await ctx.db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, transactionId));

      if (!trx) throw new TRPCError({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' });
      if (trx.status !== 'dikemas')
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Transaksi tidak bisa dikirim (status: ${trx.status})`,
        });

      const [updated] = await ctx.db
        .update(transactionsTable)
        .set({
          status: 'dikirim',
          resi: input.resi,
        })
        .where(eq(transactionsTable.id, transactionId))
        .returning();

      return {
        message: 'Pesanan ditandai telah dikirim',
        data: updated,
      };
    }),
  changeResi: adminProcedure.input(changeResiSchema).mutation(async ({ ctx, input }) => {
    const { transactionId } = input;

    const [trx] = await ctx.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, transactionId));

    if (!trx) throw new TRPCError({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' });
    if (trx.status !== 'dikirim')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Resi hanya bisa diubah untuk transaksi yang sedang dikirim (status: ${trx.status})`,
      });

    const [updated] = await ctx.db
      .update(transactionsTable)
      .set({
        resi: input.resi,
      })
      .where(eq(transactionsTable.id, transactionId))
      .returning();

    return {
      message: 'Resi pesanan berhasil diubah',
      data: updated,
    };
  }),
  markAsArrived: userProcedure.input(transactionIdSchema).mutation(async ({ ctx, input }) => {
    const { transactionId } = input;

    const [trx] = await ctx.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, transactionId));

    if (!trx) throw new TRPCError({ code: 'NOT_FOUND', message: 'Transaksi tidak ditemukan' });
    if (trx.userId !== ctx.session.user.id)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Anda tidak memiliki akses ke transaksi ini',
      });
    if (trx.status !== 'dikirim')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Transaksi tidak bisa diterima (status: ${trx.status})`,
      });

    const [updated] = await ctx.db
      .update(transactionsTable)
      .set({
        status: 'sampai',
      })
      .where(eq(transactionsTable.id, transactionId))
      .returning();

    return {
      message: 'Pesanan ditandai telah sampai, terima kasih telah berbelanja!',
      data: updated,
    };
  }),
  getUserTransactions: userProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, ctx.session.user.id));
  }),
  getTransactionDetail: userProcedure.input(transactionIdSchema).query(async ({ ctx, input }) => {
    const { transactionId } = input;

    const [trx] = await ctx.db
      .select()
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.userId, ctx.session.user.id)
        )
      );

    const items = await ctx.db
      .select()
      .from(transactionItem)
      .where(eq(transactionItem.transactionId, transactionId))
      .innerJoin(productsTable, eq(transactionItem.productId, productsTable.id));

    return { ...trx, items };
  }),
  adminGetAllTransactions: adminProcedure.query(async ({ ctx }) => {
    const trx = await ctx.db.query.transactionsTable.findMany({
      with: {
        items: true,
        user: true,
      },
    });

    return trx;
  }),
});

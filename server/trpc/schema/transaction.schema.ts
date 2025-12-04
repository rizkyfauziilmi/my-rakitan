import z from 'zod';

export const createTransactionSchema = z.object({
  items: z.array(
    z.object({
      productId: z.uuid(),
      qty: z.number(),
      price: z.number(),
    })
  ),
  address: z.string().min(1, 'Alamat tidak boleh kosong'),
});

export const transactionIdSchema = z.object({
  transactionId: z.uuid(),
});
export const markTransactionAsShippedSchema = z.object({
  transactionId: z.uuid(),
  resi: z.string().min(1, 'Resi tidak boleh kosong'),
});
export const changeResiSchema = z.object({
  transactionId: z.uuid(),
  resi: z.string().min(1, 'Resi tidak boleh kosong'),
});

export type CreateTransactionValues = z.infer<typeof createTransactionSchema>;
export type TransactionIdValues = z.infer<typeof transactionIdSchema>;
export type MarkTransactionAsShippedValues = z.infer<typeof markTransactionAsShippedSchema>;
export type ChangeResiValues = z.infer<typeof changeResiSchema>;

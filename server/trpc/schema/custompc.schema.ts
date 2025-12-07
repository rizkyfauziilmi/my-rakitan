import { filteredCategories } from '@/server/db/schema';
import z from 'zod';

export const createCustomPcSchema = z.object({
  name: z.string().min(1, 'Nama PC wajib diisi'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID wajib diisi'),
        quantity: z.number().min(1, 'Kuantitas harus minimal 1'),
        price: z.number().min(0, 'Harga harus minimal 0'),
      })
    )
    .refine((items) => items.length === filteredCategories('component').length, {
      message: `Setiap komponen wajib dipilih: ${filteredCategories('component')
        .map((cat) => cat)
        .join(', ')}`,
    }),
});

export type CreateCustomPcValues = z.infer<typeof createCustomPcSchema>;

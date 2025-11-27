import { categoryProductENUM, productENUM } from '@/server/db/schema';
import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk tidak boleh kosong'),
  description: z.string().optional(),
  imageUrl: z.url('URL gambar tidak valid').optional(),
  price: z.number().min(0, 'Harga produk tidak boleh negatif'),
  stock: z.number().min(0, 'Stok produk tidak boleh negatif').optional(),
  type: z.enum(productENUM.enumValues),
  category: z.enum(categoryProductENUM.enumValues),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.uuid('ID produk tidak valid'),
});

export const deleteProductSchema = z.object({
  id: z.uuid('ID produk tidak valid'),
});

export type createProductValues = z.infer<typeof createProductSchema>;
export type updateProductValues = z.infer<typeof updateProductSchema>;
export type deleteProductValues = z.infer<typeof deleteProductSchema>;

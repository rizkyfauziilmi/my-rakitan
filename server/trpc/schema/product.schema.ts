import { categoryProductENUM, productENUM } from '@/server/db/schema';
import z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk tidak boleh kosong'),
  description: z.string().max(150, 'Deskripsi produk maksimal 150 karakter').optional(),
  imageUrl: z.url('URL gambar tidak valid').optional(),
  price: z
    .number()
    .min(0, 'Harga produk tidak boleh negatif')
    .min(1000, 'Harga produk minimal Rp 1.000'),
  stock: z.number().min(0, 'Stok produk tidak boleh negatif'),
  type: z.enum(productENUM.enumValues, 'Tipe produk tidak valid'),
  category: z.enum(categoryProductENUM.enumValues, 'Kategori produk tidak valid'),
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

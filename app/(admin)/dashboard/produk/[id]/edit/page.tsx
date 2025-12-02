import { MainLayout } from '@/components/_layouts/main-layout';
import { caller } from '@/server/trpc/server';
import { redirect } from 'next/navigation';
import { EditProdukForm } from './_components/edit-produk-form';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await caller.product.getProductById({
    id,
  });

  if (!product) {
    redirect('/dashboard');
  }

  return (
    <MainLayout>
      <EditProdukForm product={product} />
    </MainLayout>
  );
}

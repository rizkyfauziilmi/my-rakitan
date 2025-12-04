import { MainLayout } from '@/components/_layouts/main-layout';
import { getQueryClient, trpc } from '@/server/trpc/server';
import { redirect } from 'next/navigation';
import { EditProdukForm } from './_components/edit-produk-form';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const product = await queryClient.fetchQuery(
    trpc.product.getProductById.queryOptions({
      id,
    })
  );

  if (!product) {
    redirect('/dashboard');
  }

  return (
    <MainLayout>
      <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data produk.</div>}>
        <Suspense fallback={<div>Memuat data produk...</div>}>
          <EditProdukForm />
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  );
}

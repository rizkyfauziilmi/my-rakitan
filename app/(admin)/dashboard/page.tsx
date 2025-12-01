import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { prefetch, trpc } from '@/server/trpc/server';
import { ProductTable } from './_components/product-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  prefetch(trpc.product.getAllProducts.queryOptions({}));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Admin</CardTitle>
        <CardDescription>Ringkasan data produk di toko Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data.</div>}>
          <Suspense fallback={<div>Memuat data...</div>}>
            <ProductTable />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

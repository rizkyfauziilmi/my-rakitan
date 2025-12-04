import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { ProductTable } from './_components/product-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TransactionTable } from './_components/transaction-table';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  prefetch(trpc.product.getAllProducts.queryOptions({}));
  prefetch(trpc.transaction.adminGetAllTransactions.queryOptions());

  return (
    <HydrateClient>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Admin</CardTitle>
          <CardDescription>Kelola semua produk dan transaksi di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data.</div>}>
            <Suspense fallback={<div>Memuat data...</div>}>
              <ProductTable />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data transaksi.</div>}>
            <Suspense fallback={<div>Memuat data transaksi...</div>}>
              <TransactionTable />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}

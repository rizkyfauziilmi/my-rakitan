import { MainLayout } from '@/components/_layouts/main-layout';
import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TransactionsList } from './_components/transactions-list';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  prefetch(trpc.transaction.getUserTransactions.queryOptions());

  return (
    <HydrateClient>
      <MainLayout>
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Pesanan Saya</h1>
          <p className="text-muted-foreground">Kelola dan pantau pesanan Anda</p>
        </div>

        <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data transaksi.</div>}>
          <Suspense fallback={<div>Memuat data transaksi...</div>}>
            <TransactionsList />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    </HydrateClient>
  );
}

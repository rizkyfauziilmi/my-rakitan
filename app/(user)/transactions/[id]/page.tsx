import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TransactionDetail } from './_components/transaction-detail';
import { MainLayout } from '@/components/_layouts/main-layout';

export const dynamic = 'force-dynamic';

export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  prefetch(
    trpc.transaction.getTransactionDetail.queryOptions({
      transactionId: id,
    })
  );

  return (
    <HydrateClient>
      <MainLayout>
        <ErrorBoundary fallback={<div>Failed to load transaction details.</div>}>
          <Suspense fallback={<div>Loading transaction details...</div>}>
            <TransactionDetail />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    </HydrateClient>
  );
}

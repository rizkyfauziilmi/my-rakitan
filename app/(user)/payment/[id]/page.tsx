import { getQueryClient, HydrateClient, trpc } from '@/server/trpc/server';
import { redirect } from 'next/navigation';
import { PaymentCard } from './_components/payment-card';
import { MainLayoutCentered } from '@/components/_layouts/main-layout-centered';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const transaction = await queryClient.fetchQuery(
    trpc.transaction.getTransactionDetail.queryOptions({
      transactionId: id,
    })
  );

  if (transaction.status !== 'belum_dibayar') {
    redirect(`/transactions/${transaction.id}`);
  }

  return (
    <HydrateClient>
      <MainLayoutCentered>
        <ErrorBoundary fallback={<div>Terjadi kesalahan pada pembayaran.</div>}>
          <Suspense fallback={<div>Memuat halaman pembayaran...</div>}>
            <PaymentCard />
          </Suspense>
        </ErrorBoundary>
      </MainLayoutCentered>
    </HydrateClient>
  );
}

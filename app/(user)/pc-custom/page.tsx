import { MainLayout } from '@/components/_layouts/main-layout';
import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CustomPcForm } from './_components/custom-pc-form';

export const dynamic = 'force-dynamic';

export default async function PcCustomPage() {
  prefetch(
    trpc.product.getByType.queryOptions({
      type: 'component',
      isPopular: true,
      limit: 10,
    })
  );

  return (
    <HydrateClient>
      <MainLayout>
        <ErrorBoundary fallback={<div>Something went wrong.</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomPcForm />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    </HydrateClient>
  );
}

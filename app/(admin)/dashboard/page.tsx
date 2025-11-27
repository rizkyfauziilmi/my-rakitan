import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientTest } from './_components/client-test';

export default async function AdminDashboardPage() {
  prefetch(
    trpc.hello.queryOptions({
      text: 'from admin dashboard',
    })
  );

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientTest />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

import { MainLayout } from '@/components/_layouts/main-layout';
import { HydrateClient, prefetch, trpc } from '@/server/trpc/server';
import { ProductFilter } from './_components/product-filter';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { ProductList } from './_components/product-list';
import type { SearchParams } from 'nuqs/server';
import { loadProductSearchParams } from './_lib/searchParams';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q, type, category } = await loadProductSearchParams(searchParams);
  prefetch(
    trpc.product.getSearchProduct.queryOptions({
      query: q ?? undefined,
      type: type ?? undefined,
      category: category ?? undefined,
    })
  );

  return (
    <HydrateClient>
      <MainLayout>
        <ProductFilter />
        <ErrorBoundary fallback={<div>Something went wrong.</div>}>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductList />
          </Suspense>
        </ErrorBoundary>
      </MainLayout>
    </HydrateClient>
  );
}

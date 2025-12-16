'use client';

import React, { useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { useTRPC } from '@/server/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { productSearchParams } from '../_lib/searchParams';
import { useDebounce, useIntersectionObserver } from '@uidotdev/usehooks';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductList() {
  const trpc = useTRPC();

  const [q] = useQueryState('q', productSearchParams.q);
  const [type] = useQueryState('type', productSearchParams.type);
  const [category] = useQueryState('category', productSearchParams.category);

  const debouncedQuery = useDebounce(q, 300);

  const infiniteQueryOptions = trpc.product.getSearchProduct.infiniteQueryOptions(
    {
      query: debouncedQuery ?? undefined,
      type: type ?? undefined,
      category: category ?? undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(infiniteQueryOptions);

  // Flatten pages into a single array of products
  const flattened = useMemo(() => products?.pages.flatMap((p) => p.data) ?? [], [products]);

  // Intersection observer to detect when last item is visible
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      products?.pages?.length &&
      products.pages[products.pages.length - 1].nextCursor
    ) {
      fetchNextPage();
    }
    // We intentionally only depend on `entry` to trigger when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  if (!flattened.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-zinc-400">
          Tidak ada produk yang ditemukan sesuai kriteria pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {flattened.map((product, index) => {
          const isLast = index === flattened.length - 1;
          return (
            <div key={product.id} ref={isLast ? ref : undefined}>
              <ProductCard product={product} />
            </div>
          );
        })}
        {isFetchingNextPage &&
          Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
      </div>
      <div className="mt-4 text-center">
        {!isFetchingNextPage &&
          products?.pages.length &&
          !products.pages[products.pages.length - 1].nextCursor && (
            <div className="text-center opacity-60">
              <p className="text-xs md:text-sm">Tidak ada produk lain untuk ditampilkan</p>
            </div>
          )}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return <Skeleton className="h-[564px] w-full" />;
}

export function ProductCardSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

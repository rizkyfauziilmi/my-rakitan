'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { productColumns } from './product-columns';
import { useTRPC } from '@/server/trpc/client';
import { ProductDataTable } from './product-data-table';

export function ProductTable() {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(trpc.product.getAllProducts.queryOptions({}));

  return <ProductDataTable columns={productColumns} data={products} />;
}

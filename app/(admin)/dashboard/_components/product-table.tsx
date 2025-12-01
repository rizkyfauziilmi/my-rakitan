'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { DataTable } from './data-table';
import { useTRPC } from '@/server/trpc/client';

export function ProductTable() {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(trpc.product.getAllProducts.queryOptions({}));

  return <DataTable columns={columns} data={products} />;
}

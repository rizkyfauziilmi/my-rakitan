'use client';

import { useTRPC } from '@/server/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TransactionDataTable } from './transaction-data-table';
import { transactionColumns } from './transaction-columns';

export function TransactionTable() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.transaction.adminGetAllTransactions.queryOptions());

  return <TransactionDataTable columns={transactionColumns} data={data} />;
}

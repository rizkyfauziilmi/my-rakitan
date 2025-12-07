'use client';

import { useTRPC } from '@/server/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ChevronRight, PcCase } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export function TransactionsList() {
  const trpc = useTRPC();
  const { data: transactions } = useSuspenseQuery(
    trpc.transaction.getUserTransactions.queryOptions()
  );

  return (
    <div>
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-foreground font-medium">Belum ada pesanan</p>
            <p className="text-muted-foreground text-sm">Mulai berbelanja sekarang</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {transactions.map((transaction) => {
            return (
              <Link key={transaction.id} href={`/transactions/${transaction.id}`}>
                <Card className="border-border hover:border-primary cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <p className="text-foreground font-semibold">Order #{transaction.id}</p>

                          <Badge
                            variant={
                              transaction.status === 'belum_dibayar'
                                ? 'default'
                                : transaction.status === 'dibatalkan'
                                  ? 'destructive'
                                  : transaction.status === 'dikemas'
                                    ? 'secondary'
                                    : transaction.status === 'dikirim'
                                      ? 'outline'
                                      : 'default'
                            }
                          >
                            {transaction.status
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3 text-sm">
                          {transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>

                        <p className="text-primary text-lg font-bold">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(transaction.totalPrice)}
                        </p>
                      </div>

                      <ChevronRight className="text-muted-foreground h-5 w-5" />
                    </div>
                    {transaction.customPcId && (
                      <Alert>
                        <PcCase />
                        <AlertTitle>Pembelian PC Custom terdeteksi</AlertTitle>
                        <AlertDescription>
                          Ini adalah pesanan PC Custom dengan ID: {transaction.customPcId}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

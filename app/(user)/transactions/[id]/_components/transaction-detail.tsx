'use client';

import { useTRPC } from '@/server/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Clipboard,
  CreditCard,
  Download,
  Package,
  PackageOpen,
  PackageX,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TransactionStatusType } from '@/server/db/schema';
import { ReactNode } from 'react';
import { ProductImage } from '@/components/product-image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export const iconMap: Record<TransactionStatusType, ReactNode> = {
  belum_dibayar: <CreditCard className="h-4 w-4 text-orange-500" />,
  dikemas: <Package className="h-4 w-4 text-blue-500" />,
  dikirim: <Truck className="h-4 w-4 text-purple-500" />,
  sampai: <PackageOpen className="h-4 w-4 text-green-500" />,
  dibatalkan: <PackageX className="h-4 w-4 text-red-500" />,
};
export const colorMap: Record<TransactionStatusType, string> = {
  belum_dibayar: 'text-orange-500',
  dikemas: 'text-blue-500',
  dikirim: 'text-purple-500',
  sampai: 'text-green-500',
  dibatalkan: 'text-red-500',
};

export function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: transaction } = useSuspenseQuery(
    trpc.transaction.getTransactionDetail.queryOptions({
      transactionId: id,
    })
  );
  const subtotal = transaction.items.reduce(
    (acc, { transaction_item }) => acc + transaction_item.price * transaction_item.quantity,
    0
  );
  const shipping = 10_000;
  const ppn = subtotal * 0.11;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Nomor resi berhasil disalin ke clipboard!');
    } catch {
      toast.error('Gagal menyalin nomor resi.');
    }
  };

  const cancelTransactionMutationOptions = trpc.transaction.cancelTransaction.mutationOptions({
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: trpc.transaction.getTransactionDetail.queryKey({
          transactionId: id,
        }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const cancelTransactionMutation = useMutation(cancelTransactionMutationOptions);
  const isLoadingCancelTransaction = cancelTransactionMutation.isPending;
  const markAsArrivedMutationOptions = trpc.transaction.markAsArrived.mutationOptions({
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: trpc.transaction.getTransactionDetail.queryKey({
          transactionId: id,
        }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const markAsArrivedMutation = useMutation(markAsArrivedMutationOptions);
  const isLoadingMarkAsArrived = markAsArrivedMutation.isPending;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Button onClick={() => router.push('/transactions')} className="mb-2">
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">Order #{transaction.id}</h1>
            <p className="text-muted-foreground">
              Dipesan pada{' '}
              {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Unduh Invoice
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-border bg-card mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`bg-muted rounded-lg p-3 ${colorMap[transaction.status]}`}>
                {iconMap[transaction.status]}
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Status Pesanan</p>
                <p className="text-foreground text-lg font-semibold">
                  {transaction.status
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </p>
                {transaction.status === 'dikirim' && transaction.resi && (
                  <p className="text-muted-foreground text-sm">No. Resi: {transaction.resi}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {transaction.status === 'belum_dibayar' ? (
                <>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoadingCancelTransaction}
                    onClick={() =>
                      cancelTransactionMutation.mutate({ transactionId: transaction.id })
                    }
                  >
                    {isLoadingCancelTransaction ? <Spinner /> : <PackageX />}
                    {isLoadingCancelTransaction ? 'Membatalkan...' : 'Batalkan Pesanan'}
                  </Button>
                  <Button size="sm" asChild disabled={isLoadingCancelTransaction}>
                    <Link href={`/payment/${transaction.id}`}>
                      <CreditCard />
                      Bayar Sekarang
                    </Link>
                  </Button>
                </>
              ) : transaction.status === 'dikirim' ? (
                <>
                  {transaction.resi && (
                    <Button
                      size="sm"
                      disabled={isLoadingMarkAsArrived}
                      onClick={() => handleCopy(transaction.resi!)}
                    >
                      <Clipboard />
                      Salin No. Resi
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={isLoadingMarkAsArrived}
                    onClick={() => markAsArrivedMutation.mutate({ transactionId: transaction.id })}
                  >
                    {isLoadingMarkAsArrived ? <Spinner /> : <PackageOpen />}
                    {isLoadingMarkAsArrived ? 'Memperbarui...' : 'Selesaikan Pesanan'}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card className="border-border bg-card mb-6">
        <CardHeader className="border-border border-b">
          <CardTitle className="text-foreground">Item Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {transaction.items.map((item, index) => (
              <div key={item.transaction_item.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex gap-4">
                  <div className="bg-muted h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage
                      imageUrl={item.product.imageUrl ?? ''}
                      altText={item.product.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1 font-semibold">{item.product.name}</h3>
                    <p className="text-muted-foreground mb-2 text-sm">{item.product.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        Qty: {item.transaction_item.quantity}
                      </p>
                      <p className="text-primary font-semibold">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(item.transaction_item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="border-border bg-card mb-6">
        <CardHeader className="border-border border-b">
          <CardTitle className="text-foreground">Alamat Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="p-6">{transaction.address}</CardContent>
      </Card>

      {/* Summary Section */}
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="text-foreground font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(subtotal)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Biaya Pengiriman</p>
              <p className="text-foreground font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(shipping)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">PPN (11%)</p>
              <p className="text-foreground font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(ppn)}
              </p>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <p className="text-foreground font-semibold">Total</p>
              <p className="text-primary text-2xl font-bold">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(subtotal + shipping + ppn)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

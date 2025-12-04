'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTRPC } from '@/server/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ProductImage } from '@/components/product-image';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export function PaymentCard() {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
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

  const simulatePaymentMutationOptions =
    trpc.transaction.simulateTransactionPayment.mutationOptions({
      onSuccess: ({ message, data }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.transaction.pathKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.product.pathKey(),
        });
        toast.success(message);
        router.push(`/transactions/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const simulatePaymentMutation = useMutation(simulatePaymentMutationOptions);
  const isLoading = simulatePaymentMutation.isPending;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Ringkasan Pembayaran</CardTitle>
        <CardDescription>Order ID: {transaction.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ItemGroup className="gap-4">
          {transaction.items.map(({ product: item, transaction_item }) => (
            <Item key={transaction_item.id} variant="outline" asChild role="listitem">
              <div>
                <ItemMedia variant="image">
                  <ProductImage imageUrl={item.imageUrl ?? ''} altText={item.name} />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle className="line-clamp-1">{item.name}</ItemTitle>
                  <ItemDescription>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(item.price)}{' '}
                    ={' '}
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(item.price * transaction_item.quantity)}
                  </ItemDescription>
                </ItemContent>

                <ItemContent className="flex-none text-center">
                  <ItemDescription>{`x${transaction_item.quantity}`}</ItemDescription>
                </ItemContent>
              </div>
            </Item>
          ))}
        </ItemGroup>

        <Separator />

        <p className="text-muted-foreground text-xs">Alamat Pengiriman: {transaction.address}</p>

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PPN (11%)</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(ppn)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-base">
            <span className="font-bold">Total</span>
            <span className="text-primary text-xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(subtotal + shipping + ppn)}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => simulatePaymentMutation.mutate({ transactionId: id })}
          disabled={isLoading}
        >
          {isLoading && <Spinner />}
          {isLoading ? 'Memproses...' : 'Lakukan Pembayaran'}
        </Button>
      </CardContent>
    </Card>
  );
}

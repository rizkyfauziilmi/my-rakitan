'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrushCleaning, Trash2, PcCase, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ButtonCounter } from '@/components/button-counter';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useTRPC } from '@/server/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductImage } from '@/components/product-image';

export const title = 'Drawer - Shopping Cart Example';

export function CustomPcDrawer() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const getAllMyCustomPcsQueryOptions = trpc.customPc.getCustomPcCart.queryOptions();
  const { data: pcs, isLoading, error } = useQuery(getAllMyCustomPcsQueryOptions);

  const noPcs = pcs ? pcs.length === 0 : true;
  const totalPcs = pcs ? pcs.length : 0;
  const noItems = pcs ? pcs.reduce((acc, pc) => acc + pc.items.length, 0) === 0 : true;

  const deleteCustomPcMutationOptions = trpc.customPc.deleteCustomPc.mutationOptions({
    onSuccess: () => {
      toast.success('PC Kustom berhasil dihapus dari keranjang.');
      queryClient.invalidateQueries({
        queryKey: trpc.customPc.pathKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.transaction.pathKey(),
      });
    },
    onError: () => {
      toast.error('Gagal menghapus PC Kustom dari keranjang. Silakan coba lagi.');
    },
  });
  const deleteCustomPc = useMutation(deleteCustomPcMutationOptions);
  const isDeleting = deleteCustomPc.isPending;

  return (
    <>
      {pcs ? (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
          <ButtonCounter icon={<PcCase />} count={totalPcs} onClick={() => setOpen(true)} />
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Keranjang PC Kustom Anda</DrawerTitle>
              <DrawerDescription>
                {noPcs
                  ? 'Keranjang PC Kustom Anda kosong.'
                  : `Anda memiliki ${totalPcs} PC Kustom dalam keranjang Anda.`}
              </DrawerDescription>
            </DrawerHeader>

            {isLoading || error ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Spinner />
                  </EmptyMedia>
                  <EmptyTitle>
                    {error ? 'Terjadi kesalahan saat memuat keranjang.' : 'Memuat keranjang...'}
                  </EmptyTitle>
                  <EmptyDescription>
                    {error
                      ? 'Silakan coba lagi nanti.'
                      : 'Mohon tunggu sebentar sementara kami memuat item keranjang Anda.'}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : noItems ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BrushCleaning />
                  </EmptyMedia>
                  <EmptyTitle>Keranjang PC Kustom Anda kosong.</EmptyTitle>
                  <EmptyDescription>
                    Tambahkan beberapa PC Kustom untuk melihatnya di sini.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm">
                    <Link href="/pc-custom">Buat PC Kustom Pertamamu</Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <div className="space-y-4">
                  {pcs.map((pc, index) => (
                    <Item key={pc.id} variant="outline">
                      <ItemContent>
                        <ItemTitle>
                          Custom PC #{index + 1} - {pc.name}
                        </ItemTitle>
                        <ItemDescription>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(pc.totalPrice)}
                          {pc.notes && <>&quot;{pc.notes}&quot;</>}
                        </ItemDescription>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Spesifikasi PC</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                {pc.items.map(({ product: item }) => (
                                  <div key={item.id} className="flex gap-4 border-b pb-4">
                                    <div className="bg-muted h-20 w-20 shrink-0 overflow-hidden rounded-md">
                                      {item.imageUrl && (
                                        <ProductImage
                                          imageUrl={item.imageUrl}
                                          altText={item.name}
                                        />
                                      )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                      <h4 className="line-clamp-2 text-sm font-medium">
                                        {item.name}
                                      </h4>
                                      <p className="text-muted-foreground text-xs">
                                        {item.type},{' '}
                                        {String(item.category)
                                          .split('_')
                                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                          .join(' ')}
                                      </p>

                                      <div className="mt-2 flex items-center justify-between">
                                        <div>
                                          <div className="text-sm font-medium">
                                            {new Intl.NumberFormat('id-ID', {
                                              style: 'currency',
                                              currency: 'IDR',
                                              minimumFractionDigits: 0,
                                            }).format(item.price)}
                                          </div>
                                          <div className="text-muted-foreground text-xs">x 1</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" asChild disabled={isDeleting}>
                          <Link href={`/payment/${pc.transaction.id}`}>
                            <CreditCard />
                            Bayar
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          disabled={isDeleting}
                          onClick={() => deleteCustomPc.mutate({ id: pc.id })}
                        >
                          {isDeleting ? <Spinner /> : <Trash2 />}
                        </Button>
                      </ItemActions>
                    </Item>
                  ))}
                </div>
              </div>
            )}

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Tutup Keranjang
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
}

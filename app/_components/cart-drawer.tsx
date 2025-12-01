'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrushCleaning, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
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
import { useCartStore } from '@/store/cart.store';
import { useTRPC } from '@/server/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ProductImage } from '@/components/product-image';

export const title = 'Drawer - Shopping Cart Example';

export function CartDrawer() {
  const [open, setOpen] = useState(false);

  // Cart store selectors
  const items = useCartStore((s) => s.products);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const deleteFromCart = useCartStore((s) => s.deleteFromCart);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = totalItems > 0 ? 10000 : 0; // flat shipping in IDR (example)
  const total = subtotal + shipping;

  const noItems = items.length === 0;

  const formatIDR = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  // prepare payload for server validation
  const payload = items.map((it) => ({
    id: String(it.id),
    quantity: Number(it.quantity),
  }));
  // validate stock with server when drawer opens
  const trpc = useTRPC();
  // call server procedure to validate requested quantities vs DB stock
  const { data, isLoading, error, refetch } = useQuery(
    trpc.product.validateCartStock.queryOptions(
      {
        items: payload,
      },
      {
        enabled: open && items.length !== 0,
      }
    )
  );

  useEffect(() => {
    // only validate when drawer is opened and there are items
    if (!open || items.length === 0) return;

    // refresh query when drawer is opened
    refetch();

    // sync cart with server validation results
    if (data && !data.valid && data.mismatches && data.mismatches.length > 0) {
      data.mismatches.forEach((m) => {
        if (typeof m.available !== 'number') return;
        if (m.available <= 0) {
          // remove item from cart if no stock available
          deleteFromCart(m.id);
        } else {
          // reduce quantity to available amount
          updateQuantity(m.id, m.available, m.available);
        }
      });
    }
  }, [data, deleteFromCart, items.length, open, refetch, updateQuantity]);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <ButtonCounter icon={<ShoppingCart />} count={totalItems} onClick={() => setOpen(true)} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Keranjang Belanja</DrawerTitle>
          <DrawerDescription>
            {noItems
              ? 'Keranjang Anda kosong.'
              : `Anda memiliki ${totalItems} item di keranjang Anda.`}
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
              <EmptyTitle>Keranjang Anda kosong</EmptyTitle>
              <EmptyDescription>
                Tambahkan beberapa produk ke keranjang Anda untuk memulai.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">
                <Link href="/produk">Telusuri Produk</Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="bg-muted h-20 w-20 shrink-0 overflow-hidden rounded-md">
                    {item.imageUrl && <ProductImage imageUrl={item.imageUrl} altText={item.name} />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {item.type},{' '}
                      {String(item.category)
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{formatIDR(item.price)}</div>
                        <div className="text-muted-foreground text-xs">x {item.quantity}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label={`Decrease quantity for ${item.name}`}
                          onClick={() => {
                            const next = item.quantity - 1;
                            updateQuantity(item.id as string, next);
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="px-2 text-sm font-medium">{item.quantity}</div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label={`Increase quantity for ${item.name}`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => {
                            if (item.quantity >= item.stock) {
                              toast.error(`Stok untuk ${item.name} tidak mencukupi.`);
                              return;
                            }
                            // addToCart will increment quantity for an existing item
                            addToCart(item);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => deleteFromCart(item.id as string)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-2 text-xs">
                      Subtotal: {formatIDR(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatIDR(shipping)}</span>
              </div>

              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
            </div>
          </div>
        )}

        <DrawerFooter className="flex flex-col gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              // Replace this with real checkout flow
              // For now just close drawer
              setOpen(false);
              // for debugging you could alert or route to checkout page
            }}
          >
            Checkout
          </Button>
          <div className="flex w-full items-center gap-2">
            {!noItems && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  clearCart();
                }}
              >
                Kosongkan Keranjang
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Lanjut Belanja
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

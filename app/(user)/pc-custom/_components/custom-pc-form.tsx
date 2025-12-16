'use client';

import AddressPicker from '@/components/address-picker-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useTRPC } from '@/server/trpc/client';
import { createCustomPcSchema, CreateCustomPcValues } from '@/server/trpc/schema/custompc.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

export function CustomPcForm() {
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products } = useSuspenseQuery(
    trpc.product.getByType.queryOptions({
      type: 'component',
      isPopular: true,
    })
  );

  const toastId = 'create-custom-pc-toast';

  const createTransactionMutationOptions = trpc.transaction.createTransaction.mutationOptions({});

  const createTransactionMutation = useMutation(createTransactionMutationOptions);

  const createCustomPcMutationOptions = trpc.customPc.createCustomPc.mutationOptions({});
  const createCustomPcMutation = useMutation(createCustomPcMutationOptions);

  const isLoadingCTMutation = createTransactionMutation.isPending;
  const isLoadingCPMutation = createCustomPcMutation.isPending;
  const isLoadingMutation = isLoadingCTMutation || isLoadingCPMutation;

  const form = useForm<CreateCustomPcValues>({
    resolver: zodResolver(createCustomPcSchema),
    defaultValues: {
      name: '',
      items: [],
    },
  });

  function onSubmit() {
    setOpenAddressDialog(true);
  }

  const groupedByCategory = products.reduce(
    (acc, item) => {
      const category = item.category as keyof typeof acc;

      if (!acc[category]) {
        acc[category] = [];
      }

      // pilih field yang ingin disimpan (normalized)
      acc[category].push({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        sold: item.sold,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{ id: string; name: string; price: number; stock: number; sold: number }>
    >
  );

  const items = useWatch({
    control: form.control,
    name: 'items',
  });

  const totalPrice = items.reduce((acc, item) => acc + (item?.price || 0) * 1, 0);

  return (
    <div>
      <form id="custom-pc-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="custom-pc-name">Nama Custom PC Kamu</FieldLabel>
                <Input
                  {...field}
                  id="custom-pc-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan nama custom PC kamu"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="items"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="grid gap-4 overflow-x-auto md:grid-cols-2">
                {Object.entries(groupedByCategory).map(([category, items]) => (
                  <Field data-invalid={fieldState.invalid} key={category}>
                    <FieldLabel htmlFor={`custom-pc-${category}`}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={
                        field.value[Object.keys(groupedByCategory).indexOf(category)]?.productId ||
                        ''
                      }
                      onValueChange={(value) => {
                        // update items
                        const newItems = [...field.value];
                        const index = Object.keys(groupedByCategory).indexOf(category);
                        const price = items.find((item) => item.id === value)?.price || 0;
                        newItems[index] = { productId: value, quantity: 1, price };
                        field.onChange(newItems);
                      }}
                    >
                      <SelectTrigger
                        value=""
                        aria-invalid={fieldState.invalid}
                        id={`custom-pc-${category}`}
                      >
                        <SelectValue placeholder={`Pilih ${category}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id} disabled={item.stock === 0}>
                            {item.name} -{' '}
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            }).format(item.price)}{' '}
                            {item.stock === 0 ? '(Stok Habis)' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                ))}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />
        </FieldGroup>
      </form>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight md:text-2xl">
          Total Harga Custom PC Kamu:
        </h3>
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight md:text-2xl">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(totalPrice)}
        </h3>
      </div>
      <div>
        <Button
          type="submit"
          form="custom-pc-form"
          className="mt-4 w-full"
          disabled={isLoadingMutation}
        >
          {isLoadingMutation && <Spinner />}
          {isLoadingMutation ? 'Memproses...' : 'Buat Custom PC'}
        </Button>
        <Button
          variant="link"
          className="mt-2 w-full"
          onClick={() => form.reset()}
          disabled={isLoadingMutation}
        >
          Reset
        </Button>
      </div>
      <AddressPicker
        open={openAddressDialog}
        setOpenChange={setOpenAddressDialog}
        isLoading={isLoadingMutation}
        onSubmit={(address) => {
          // create custom pc first
          toast.loading('Membuat custom PC dan transaksi...', {
            id: toastId,
          });

          createCustomPcMutation.mutate(form.getValues(), {
            onSuccess: ({ data }) => {
              queryClient.invalidateQueries({ queryKey: trpc.customPc.pathKey() });

              createTransactionMutation.mutate(
                {
                  items: form.getValues().items.map((item) => ({
                    productId: item.productId,
                    qty: item.quantity,
                    price: item.price,
                  })),
                  customPcId: data.id,
                  address,
                },
                {
                  onSuccess: ({ data }) => {
                    setOpenAddressDialog(false);
                    queryClient.invalidateQueries({ queryKey: trpc.transaction.pathKey() });
                    toast.success('Berhasil membuat transaksi dan custom PC!', {
                      description: 'Silakan lanjutkan ke Pembayaran.',
                      id: toastId,
                    });
                    router.push(`/payment/${data.id}`);
                  },
                  onError: (error) =>
                    toast.error('Gagal membuat transaksi. Silakan coba lagi.', {
                      description: error.message,
                      id: toastId,
                    }),
                }
              );
            },
            onError: (error) => {
              toast.error('Gagal membuat custom PC. Silakan coba lagi.', {
                description: error.message,
                id: toastId,
              });
            },
          });
        }}
      />
    </div>
  );
}

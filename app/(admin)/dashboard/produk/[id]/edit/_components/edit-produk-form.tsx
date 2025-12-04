'use client';

import { updateProductSchema, updateProductValues } from '@/server/trpc/schema/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import * as React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { CurrencyInput } from '@/components/currency-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CategoryProductType,
  filteredCategories,
  productENUM,
  ProductType,
} from '@/server/db/schema';
import { useTRPC } from '@/server/trpc/client';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';

export function EditProdukForm() {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: product } = useSuspenseQuery(
    trpc.product.getProductById.queryOptions({
      id,
    })
  );

  const form = useForm<updateProductValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product?.id,
      name: product?.name,
      imageUrl: product?.imageUrl ?? undefined,
      description: product?.description ?? undefined,
      price: product?.price,
      stock: product?.stock,
      type: product?.type,
      category: product?.category,
    },
  });

  const updateProductMutationOptions = trpc.product.updateProduct.mutationOptions({
    onError: (error) => {
      toast.error('Gagal memperbarui produk!', {
        description: error.message,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: trpc.product.pathKey(),
      });
      router.push('/dashboard');
    },
  });
  const updateProductMutation = useMutation(updateProductMutationOptions);

  function onSubmit(data: updateProductValues) {
    updateProductMutation.mutate(data);
  }

  const isLoading = form.formState.isSubmitting || updateProductMutation.isPending;

  const type = useWatch({
    control: form.control,
    name: 'type',
  }) as ProductType | undefined;
  const name = useWatch({
    control: form.control,
    name: 'name',
  });
  const imageUrl = useWatch({
    control: form.control,
    name: 'imageUrl',
  });
  const description = useWatch({
    control: form.control,
    name: 'description',
  });
  const price = useWatch({
    control: form.control,
    name: 'price',
  });
  const stock = useWatch({
    control: form.control,
    name: 'stock',
  });
  const category = useWatch({
    control: form.control,
    name: 'category',
  }) as CategoryProductType | undefined;

  const categories = type ? filteredCategories(type) : [];

  return (
    <div className="flex items-center justify-center gap-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tambah Produk</CardTitle>
          <CardDescription>
            Gunakan form di bawah untuk menambahkan produk baru ke inventaris Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="create-product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-name">Nama Produk</FieldLabel>
                    <Input
                      {...field}
                      id="product-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: Intel Core i9-13900K"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-image-url">URL Gambar Produk</FieldLabel>
                    <Input
                      {...field}
                      id="product-image-url"
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: https://example.com/image.jpg"
                      type="url"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                    <FieldLabel htmlFor="product-description">Deskripsi Produk</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="product-description"
                        placeholder="Contoh: Prosesor Intel Core i9 generasi ke-13 dengan 24 core dan kecepatan hingga 5.8 GHz."
                        maxLength={150}
                        rows={6}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                      />
                      {field.value && (
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/150 karakter
                          </InputGroupText>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    <FieldDescription>
                      Berikan deskripsi singkat tentang produk (maksimal 150 karakter).
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-price">Harga Produk (dalam Rupiah)</FieldLabel>
                    <CurrencyInput
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      id="product-price"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-stock">Stok Produk</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      id="product-stock"
                      type="number"
                      min={0}
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-type">Tipe Produk</FieldLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value as ProductType);
                        // clear category safely (avoid passing `undefined` where not allowed)
                        form.setValue('category', '' as unknown as CategoryProductType);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {productENUM.enumValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="product-category">Kategori Produk</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as CategoryProductType)}
                      value={field.value}
                      disabled={!type}
                    >
                      <SelectTrigger value="">
                        <SelectValue placeholder="Pilih kategori produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat
                              .split('_')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" disabled={isLoading}>
              <Link href="/dashboard">Batal</Link>
            </Button>
            <Button type="submit" form="create-product-form" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </Field>
        </CardFooter>
      </Card>
      <ProductCard
        product={{
          name: name ?? '',
          imageUrl: imageUrl ?? null,
          description: description ?? null,
          price: price ?? 0,
          stock: stock ?? 0,
          sold: 0,
          type: type ?? 'component',
          category: category ?? 'cpu',
          createdAt: new Date(),
          updatedAt: new Date(),
          id: 'preview-id',
        }}
        isDemo={true}
      />
    </div>
  );
}

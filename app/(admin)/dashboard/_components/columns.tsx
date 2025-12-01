'use client';

import { formatRelativeToNow } from '@/lib/date';
import { productsTable } from '@/server/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, ImageOff, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from './data-table-column-header';
import { DeleteProductAlert } from './delete-product-alert';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

export const columns: ColumnDef<typeof productsTable.$inferSelect>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'imageUrl',
    header: '',
    cell: function ImageCell({ row }) {
      const { imageUrl, name } = row.original;
      const [isImageCanRendered, setIsImageCanRendered] = useState(true);

      return isImageCanRendered && imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className="aspect-square rounded-md object-cover"
          onError={() => setIsImageCanRendered(false)}
          onLoad={() => setIsImageCanRendered(true)}
        />
      ) : (
        <div className="bg-muted flex size-[50px] items-center justify-center rounded-md">
          <ImageOff />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nama Produk" />;
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Deskripsi" />;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Harga" />;
    },
    cell: ({ row }) => {
      const price = row.original.price;
      return (
        <div>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(price)}
        </div>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Stok" />;
    },
    cell: ({ row }) => {
      const stock = row.original.stock;
      return <div className="text-center">{stock}</div>;
    },
  },
  {
    accessorKey: 'sold',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Terjual" />;
    },
    cell: ({ row }) => {
      const sold = row.original.sold;
      return <div className="text-center">{sold}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tipe" />;
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Kategori" />;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Dibuat Pada" />;
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <div className="text-center">{formatRelativeToNow(createdAt)}</div>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Diperbarui Pada" />;
    },
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return <div className="text-center">{formatRelativeToNow(updatedAt)}</div>;
    },
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const { id } = row.original;
      const router = useRouter();

      const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                {isLoading ? <Spinner /> : <MoreHorizontal className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/dashboard/produk/${id}/edit`)}>
                <Edit />
                Ubah
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                <Trash />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteProductAlert
            productId={id}
            open={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
            setIsDeleting={setIsLoading}
          />
        </>
      );
    },
  },
];

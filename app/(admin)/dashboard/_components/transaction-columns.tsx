'use client';

import { formatRelativeToNow } from '@/lib/date';
import { user, transactionsTable, transactionItem } from '@/server/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { Barcode, Truck } from 'lucide-react';
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
import { Spinner } from '@/components/ui/spinner';
import { colorMap, iconMap } from '@/app/(user)/transactions/[id]/_components/transaction-detail';
import { UserDisplay } from '@/components/user-display';
import { useState } from 'react';
import { ResiDialog } from './resi-dialog';
import { UpdateResiDialog } from './update-resi-dialog';

type Transaction = typeof transactionsTable.$inferSelect & {
  user: typeof user.$inferSelect;
  items: (typeof transactionItem.$inferSelect)[];
};

export const transactionColumns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID Pesanan" />;
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return <div className="truncate font-mono">{id}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-4">
          <div className={`bg-muted rounded-lg p-3 ${colorMap[status]}`}>{iconMap[status]}</div>
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Status Pesanan</p>
            <p className="text-foreground font-semibold">
              {status
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Harga" />;
    },
    cell: ({ row }) => {
      const totalPrice = row.original.totalPrice;
      return (
        <div>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(totalPrice)}
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Pelanggan" />;
    },
    cell: ({ row }) => {
      const user = row.original.user;
      return <UserDisplay user={user} />;
    },
  },
  {
    accessorKey: 'items',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Jumlah Item" />;
    },
    cell: ({ row }) => {
      const items = row.original.items;
      return <div>x{items.length}</div>;
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
      const { id, status, resi } = row.original;

      const [isResiDialogOpen, setIsResiDialogOpen] = useState(false);
      const [isUpdateResiDialogOpen, setUpdateResiDialogOpen] = useState(false);
      const [isMaSLoading, setMaSIsLoading] = useState(false);
      const [isUpdateLoading, setIsUpdateLoading] = useState(false);

      const isLoading = isMaSLoading || isUpdateLoading;

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
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              {status === 'dikemas' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsResiDialogOpen(true)}
                    disabled={isMaSLoading}
                  >
                    {isMaSLoading ? <Spinner /> : <Truck />}
                    {isMaSLoading ? 'Memproses...' : 'Tandai Dikirim'}
                  </DropdownMenuItem>
                </>
              )}
              {status === 'dikirim' && resi && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setUpdateResiDialogOpen(true)}
                    disabled={isUpdateLoading}
                  >
                    {isUpdateLoading ? <Spinner /> : <Barcode />}
                    {isUpdateLoading ? 'Memproses...' : 'Perbarui Nomor Resi'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ResiDialog
            transactionId={id}
            open={isResiDialogOpen}
            onOpenChange={setIsResiDialogOpen}
            setIsLoading={setMaSIsLoading}
          />
          {resi && (
            <UpdateResiDialog
              transactionId={id}
              resi={resi}
              open={isUpdateResiDialogOpen}
              onOpenChange={setUpdateResiDialogOpen}
              setIsLoading={setIsUpdateLoading}
            />
          )}
        </>
      );
    },
  },
];

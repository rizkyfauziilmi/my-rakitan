'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTRPC } from '@/server/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResiDialogProps {
  transactionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export function ResiDialog({ open, onOpenChange, transactionId, setIsLoading }: ResiDialogProps) {
  const [nomorResi, setNomorResi] = useState('');
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastId = 'mark-as-shipped-toast';

  const markAsShippedMutationOptions = trpc.transaction.markAsShipped.mutationOptions({
    onSuccess: ({ message }) => {
      toast.success(message, { id: toastId });
      queryClient.invalidateQueries({
        queryKey: trpc.transaction.pathKey(),
      });
      onOpenChange(false);
      setIsLoading?.(false);
    },
    onError: (error) => {
      toast.error('Gagal menandai produk sebagai dikirim.', {
        description: error.message,
        id: toastId,
      });
      setIsLoading?.(false);
    },
    onMutate: () => {
      toast.loading('Memproses...', { id: toastId });
      setIsLoading?.(true);
    },
  });
  const markAsShippedMutation = useMutation(markAsShippedMutationOptions);
  const isLoading = markAsShippedMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tandai Produk Sebagai Dikirim</DialogTitle>
          <DialogDescription>Masukkan nomor resi pengiriman untuk produk ini.</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="nomor-resi">Nomor Resi Pengiriman</Label>
          <Input
            id="nomor-resi"
            value={nomorResi}
            onChange={(e) => setNomorResi(e.target.value)}
            placeholder="Masukkan nomor resi"
            className="mt-2 w-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild disabled={isLoading}>
            <Button variant="outline" disabled={isLoading}>
              Batalkan
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading || nomorResi.trim() === ''}
            onClick={() =>
              markAsShippedMutation.mutate({
                transactionId,
                resi: nomorResi.trim(),
              })
            }
            className="flex-1"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Memproses...' : 'Tandai Sebagai Dikirim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

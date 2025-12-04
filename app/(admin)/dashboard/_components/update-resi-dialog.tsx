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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UpdateResiDialogProps {
  transactionId: string;
  resi: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export function UpdateResiDialog({
  open,
  onOpenChange,
  transactionId,
  resi,
  setIsLoading,
}: UpdateResiDialogProps) {
  const [nomorResi, setNomorResi] = useState(resi);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastId = 'update-resi-transaction-' + transactionId;

  const updateResiMutationOptions = trpc.transaction.changeResi.mutationOptions({
    onSuccess: ({ message }) => {
      toast.success(message, { id: toastId });
      queryClient.invalidateQueries({
        queryKey: trpc.transaction.pathKey(),
      });
      onOpenChange(false);
      setIsLoading?.(false);
    },
    onError: (error) => {
      toast.error('Gagal memperbarui nomor resi.', {
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
  const updateResiMutation = useMutation(updateResiMutationOptions);
  const isLoading = updateResiMutation.isPending;

  // set initial resi when dialog opens
  useEffect(() => {
    setNomorResi(resi);
  }, [resi]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perbarui Nomor Resi Pengiriman</DialogTitle>
          <DialogDescription>Masukkan nomor resi pengiriman untuk transaksi ini.</DialogDescription>
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
              updateResiMutation.mutate({
                transactionId,
                resi: nomorResi.trim(),
              })
            }
            className="flex-1"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Memproses...' : 'Perbarui Resi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTRPC } from '@/server/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DeleteProductAlertProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setIsDeleting?: (isDeleting: boolean) => void;
}

export function DeleteProductAlert({
  productId,
  open,
  onOpenChange,
  setIsDeleting,
}: DeleteProductAlertProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastId = 'delete-product-toast';

  const deleteProductMutationOptions = trpc.product.deleteProduct.mutationOptions({
    onError: (error) => {
      toast.error('Gagal menghapus produk!', {
        description: error.message,
        id: toastId,
      });
      setIsDeleting?.(false);
    },
    onSuccess: (data) => {
      toast.success(data.message, { id: toastId });
      queryClient.invalidateQueries({ queryKey: trpc.product.pathKey() });
      onOpenChange(false);
      setIsDeleting?.(false);
    },
    onMutate: () => {
      toast.loading('Menghapus produk...', { id: toastId });
      setIsDeleting?.(true);
    },
  });
  const deleteProductMutation = useMutation(deleteProductMutationOptions);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus produk ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Produk dengan ID <strong>{productId}</strong> akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteProductMutation.mutate({
                id: productId,
              })
            }
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

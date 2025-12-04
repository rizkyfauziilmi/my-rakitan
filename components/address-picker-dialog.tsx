'use client';

import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useTRPC } from '@/server/trpc/client';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart.store';
import { Spinner } from './ui/spinner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LocationItem {
  code: string;
  name: string;
}

interface ApiResponse {
  data: LocationItem[];
  meta: {
    administrative_area_level: number;
    updated_at: string;
  };
}

async function fetcher(url: string): Promise<ApiResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

interface AddressPickerProps {
  open: boolean;
  setOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddressPicker({ setOpenChange, open, onSuccess }: AddressPickerProps) {
  const [selectedProvince, setSelectedProvince] = useState<LocationItem | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<LocationItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<LocationItem | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<LocationItem | null>(null);
  const [customAddress, setCustomAddress] = useState('');

  const items = useCartStore((s) => s.products);
  const clearCart = useCartStore((s) => s.clearCart);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: provincesData, isLoading: loadingProvinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => fetcher('/api/provinces'),
  });

  const provinces = provincesData?.data ?? [];

  const { data: regenciesData, isLoading: loadingRegencies } = useQuery({
    queryKey: ['regencies', selectedProvince?.code],
    queryFn: () => fetcher(`/api/regencies/${selectedProvince?.code}`),
    enabled: !!selectedProvince,
  });

  const regencies = regenciesData?.data ?? [];

  const { data: districtsData, isLoading: loadingDistricts } = useQuery({
    queryKey: ['districts', selectedRegency?.code],
    queryFn: () => fetcher(`/api/districts/${selectedRegency?.code}`),
    enabled: !!selectedRegency,
  });

  const districts = districtsData?.data ?? [];

  const { data: villagesData, isLoading: loadingVillages } = useQuery({
    queryKey: ['villages', selectedDistrict?.code],
    queryFn: () => fetcher(`/api/villages/${selectedDistrict?.code}`),
    enabled: !!selectedDistrict,
  });

  const villages = villagesData?.data ?? [];

  // ======================
  // 🔢 Full address builder
  // ======================
  const fullAddress = useMemo(() => {
    const parts: string[] = [];
    if (selectedVillage?.name) parts.push(selectedVillage.name);
    if (selectedDistrict?.name) parts.push(selectedDistrict.name);
    if (selectedRegency?.name) parts.push(selectedRegency.name);
    if (selectedProvince?.name) parts.push(selectedProvince.name);

    const base = parts.join(', ');

    return customAddress.trim()
      ? `${customAddress.trim()}${base ? ', ' + base : ''}`
      : base || 'Belum ada alamat yang dipilih';
  }, [selectedProvince, selectedRegency, selectedDistrict, selectedVillage, customAddress]);

  // ======================
  // 🌀 Handlers
  // ======================

  const handleProvinceChange = (code: string) => {
    setSelectedProvince(provinces.find((x) => x.code === code) || null);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
  };

  const handleRegencyChange = (code: string) => {
    setSelectedRegency(regencies.find((x) => x.code === code) || null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
  };

  const handleDistrictChange = (code: string) => {
    setSelectedDistrict(districts.find((x) => x.code === code) || null);
    setSelectedVillage(null);
  };

  const handleVillageChange = (code: string) => {
    setSelectedVillage(villages.find((x) => x.code === code) || null);
  };

  const clearAddress = () => {
    setSelectedProvince(null);
    setSelectedRegency(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
    setCustomAddress('');
  };

  // ======================
  // 💵 Create Transaction
  // ======================

  const mutationOptions = trpc.transaction.createTransaction.mutationOptions({
    onSuccess: ({ data, message }) => {
      clearCart();
      clearAddress();
      setOpenChange(false);
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: trpc.transaction.pathKey() });
      toast.success(message);
      router.push(`/payment/${data.id}`);
    },
    onError: () => toast.error('Gagal membuat transaksi. Silakan coba lagi.'),
  });

  const createTransactionMutation = useMutation(mutationOptions);
  const isLoading = createTransactionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Isi Alamat Pemesanan</DialogTitle>
          <DialogDescription>
            Silakan pilih alamat lengkap Anda. <br />
            <strong>Alamat Terpilih:</strong> {fullAddress}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Province */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Provinsi</label>
            <Select value={selectedProvince?.code || ''} onValueChange={handleProvinceChange}>
              <SelectTrigger className="w-full" disabled={loadingProvinces}>
                <SelectValue placeholder={loadingProvinces ? 'Memuat...' : 'Pilih Provinsi'} />
              </SelectTrigger>
              <SelectContent>
                {loadingProvinces ? (
                  <Spinner />
                ) : (
                  provinces.map((i) => (
                    <SelectItem key={i.code} value={i.code}>
                      {i.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Regency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kabupaten/Kota</label>
            <Select
              value={selectedRegency?.code || ''}
              onValueChange={handleRegencyChange}
              disabled={!selectedProvince || loadingRegencies}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loadingRegencies ? 'Memuat...' : 'Pilih Kabupaten/Kota'}
                />
              </SelectTrigger>
              <SelectContent>
                {loadingRegencies ? (
                  <Spinner />
                ) : (
                  regencies.map((i) => (
                    <SelectItem key={i.code} value={i.code}>
                      {i.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kecamatan</label>
            <Select
              value={selectedDistrict?.code || ''}
              onValueChange={handleDistrictChange}
              disabled={!selectedRegency || loadingDistricts}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingDistricts ? 'Memuat...' : 'Pilih Kecamatan'} />
              </SelectTrigger>
              <SelectContent>
                {loadingDistricts ? (
                  <Spinner />
                ) : (
                  districts.map((i) => (
                    <SelectItem key={i.code} value={i.code}>
                      {i.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Village */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kelurahan/Desa</label>
            <Select
              value={selectedVillage?.code || ''}
              onValueChange={handleVillageChange}
              disabled={!selectedDistrict || loadingVillages}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingVillages ? 'Memuat...' : 'Pilih Kelurahan/Desa'} />
              </SelectTrigger>
              <SelectContent>
                {loadingVillages ? (
                  <Spinner />
                ) : (
                  villages.map((i) => (
                    <SelectItem key={i.code} value={i.code}>
                      {i.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Detail Alamat (Opsional)</label>
            <Textarea
              placeholder="Contoh: Jl. Merpati No. 123, Blok C"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="min-h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild disabled={isLoading}>
            <Button variant="outline" disabled={isLoading}>
              Batal
            </Button>
          </DialogClose>

          <Button
            disabled={
              !selectedProvince ||
              !selectedRegency ||
              !selectedDistrict ||
              customAddress.trim() === '' ||
              isLoading
            }
            onClick={() =>
              createTransactionMutation.mutate({
                items: items.map((item) => ({
                  productId: item.id,
                  qty: item.quantity,
                  price: item.price,
                })),
                address: fullAddress,
              })
            }
          >
            {isLoading && <Spinner />}
            {isLoading ? 'Memproses...' : 'Lanjutkan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

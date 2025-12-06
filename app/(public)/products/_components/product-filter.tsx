'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productENUM, categoriesMap, ProductType, CategoryProductType } from '@/server/db/schema';
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { productSearchParams } from '../_lib/searchParams';

export function ProductFilter() {
  const [query, setQuery] = useQueryState('q', productSearchParams.q);
  const [selectedType, setSelectedType] = useQueryState('type', productSearchParams.type);
  const [selectedCategory, setSelectedCategory] = useQueryState(
    'category',
    productSearchParams.category
  );

  const formatLabel = (s: string) =>
    s
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  const resetFilters = () => {
    setSelectedType(null);
    setSelectedCategory(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          value={query ?? ''}
          onChange={(e) => setQuery(e.target.value.trim() === '' ? null : e.target.value)}
          type="text"
          placeholder="Cari produk..."
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <Select
            value={selectedType ?? ''}
            onValueChange={(val) => {
              const v = val as ProductType;
              setSelectedType(v);
              // Reset category selection whenever the product type changes to avoid invalid/disabled categories.
              setSelectedCategory(null);
            }}
          >
            <SelectTrigger className="w-[180px]" value="">
              <SelectValue placeholder="Pilih Tipe Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipe</SelectLabel>
                {productENUM.enumValues.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatLabel(type)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={selectedCategory ?? ''}
            onValueChange={(val: CategoryProductType) => setSelectedCategory(val)}
          >
            <SelectTrigger className="w-[280px]" value="">
              <SelectValue placeholder="Pilih Kategori Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {productENUM.enumValues.map((type) => {
                  const cats = (categoriesMap[type as ProductType] ?? []) as CategoryProductType[];
                  const disabledForOtherTypes = selectedType ? selectedType !== type : false;
                  return (
                    <React.Fragment key={type}>
                      <SelectLabel>{formatLabel(type)}</SelectLabel>
                      {cats.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          disabled={disabledForOtherTypes}
                        >
                          {formatLabel(category)}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          {(selectedType || selectedCategory) && (
            <Button onClick={resetFilters} variant="destructive" size="icon">
              <FilterX />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

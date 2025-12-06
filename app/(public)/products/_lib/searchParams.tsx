import {
  categoryProductENUM,
  CategoryProductType,
  productENUM,
  ProductType,
} from '@/server/db/schema';
import { parseAsString, parseAsStringEnum, createLoader, debounce } from 'nuqs/server';

export const productSearchParams = {
  q: parseAsString.withOptions({
    shallow: false,
    limitUrlUpdates: debounce(300),
  }),
  type: parseAsStringEnum<ProductType>(productENUM.enumValues).withOptions({
    shallow: false,
  }),
  category: parseAsStringEnum<CategoryProductType>(categoryProductENUM.enumValues).withOptions({
    shallow: false,
  }),
};

export const loadProductSearchParams = createLoader(productSearchParams);

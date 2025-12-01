'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { productsTable } from '@/server/db/schema';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { authClient } from '@/lib/auth-client';

interface ProductCardProps {
  product: typeof productsTable.$inferSelect;
  isDemo?: boolean;
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isDemo = false }, ref) => {
    const { id, name, description, price, stock, sold, category, type, imageUrl } = product;
    const addToCart = useCartStore((state) => state.addToCart);
    const products = useCartStore((state) => state.products);
    const { data: session } = authClient.useSession();

    const currentCartItem = products.find((item) => item.id === id);

    const [imageError, setImageError] = useState(false);
    const isOutOfStock = stock === 0;

    const handleAddToCart = async () => {
      if (isDemo) return;

      addToCart(product);
    };

    const isEventDisabled = isDemo;
    const isStockInsufficient =
      currentCartItem !== undefined ? currentCartItem.quantity >= stock : false;

    return (
      <Card
        ref={ref}
        className={cn(
          'w-full max-w-lg overflow-hidden transition-all duration-200 hover:shadow-md',
          isEventDisabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {/* Product Image */}
        <div className="bg-muted relative h-48 w-full overflow-hidden">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="from-muted to-muted-foreground/10 flex h-full w-full items-center justify-center bg-linear-to-br">
              <ImageOff size={48} />
            </div>
          )}
        </div>

        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg">{name}</CardTitle>
              <CardDescription className="mt-1 text-xs">
                <span className="capitalize">{type}</span>
                {' • '}
                <span className="capitalize">{category}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <span className="text-primary shrink-0 font-semibold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(price)}
          </span>

          {description && (
            <p className="text-muted-foreground line-clamp-3 text-sm">{description}</p>
          )}

          {/* Stock Status */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Stock: <span className="font-semibold">{stock}</span>
            </span>
            {sold > 0 && (
              <span className="text-muted-foreground">
                Sold: <span className="font-semibold">{sold}</span>
              </span>
            )}
          </div>
        </CardContent>

        {/* Footer with Add to Cart Button */}
        {session?.user.role !== 'admin' && (
          <CardFooter className="gap-2 border-t">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isEventDisabled || isStockInsufficient}
              className="flex-1"
              variant={isEventDisabled ? 'outline' : 'default'}
            >
              {!isOutOfStock && <ShoppingCart />}
              {isOutOfStock ? 'Tidak Tersedia' : 'Tambah ke Keranjang'}
            </Button>
          </CardFooter>
        )}

        {/* Demo Mode Badge */}
        {isDemo && (
          <div className="bg-primary/90 text-primary-foreground absolute top-2 right-2 rounded-md px-2 py-1 text-xs">
            Demo
          </div>
        )}
      </Card>
    );
  }
);

ProductCard.displayName = 'ProductCard';

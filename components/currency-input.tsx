'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const title = 'Input Mata Uang (IDR)';

export function CurrencyInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium">
        Rp
      </span>
      <Input
        {...props}
        className={cn('bg-background pl-9', className)}
        id="currency-input"
        min="0"
        step="1"
        type="number"
      />
    </div>
  );
}

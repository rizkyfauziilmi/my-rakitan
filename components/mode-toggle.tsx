'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ModeToggleProps {
  isFull?: boolean;
}

export function ModeToggle({ isFull = false }: ModeToggleProps) {
  const { setTheme, theme } = useTheme();

  const themeText = theme === 'system' ? 'Sistem' : theme === 'light' ? 'Terang' : 'Gelap';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={isFull ? 'default' : 'icon'}
          className={cn(isFull && 'w-full')}
        >
          {isFull ? (
            <>
              <Sun className="scale-100 dark:scale-0" />
              <Moon className="scale-0 dark:scale-100" />
            </>
          ) : (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </>
          )}
          {isFull && themeText}
          <span className="sr-only">Ubah Mode Tampilan</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isFull ? 'center' : 'end'}>
        <DropdownMenuItem onClick={() => setTheme('light')}>Terang</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Gelap</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>Sistem</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

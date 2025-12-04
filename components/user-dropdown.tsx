'use client';

import { LayoutDashboard, LogOut, Package } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient, Session } from '@/lib/auth-client';
import { toast } from 'sonner';
import { usernameToAvatarFallback } from '@/lib/string';
import Link from 'next/link';

export function UserDropdown({ session }: { session: Session }) {
  const { user } = session;
  const isAdmin = user.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? ''} alt={user.name} />
          <AvatarFallback className="rounded-lg">
            {usernameToAvatarFallback(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image ?? ''} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {usernameToAvatarFallback(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/transactions">
                <Package />
                Transaksi Saya
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  toast.success('Berhasil keluar!');
                },
              },
            });
          }}
        >
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

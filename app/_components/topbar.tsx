'use client';

import { Facebook } from '@/components/svgs/facebook';
import { Instagram } from '@/components/svgs/instagram';
import { XformerlyTwitter } from '@/components/svgs/x-twitter';
import { YouTube } from '@/components/svgs/youtube';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { NavBar } from './navbar';

export function Topbar() {
  return (
    <div className="sticky top-0 z-50">
      <TopBarBanner />
      <NavBar />
    </div>
  );
}

function TopBarBanner() {
  return (
    <div className="bg-primary text-primary-foreground w-full">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:px-6">
        {/* LEFT */}
        <div className="flex flex-shrink-0 items-center gap-4 text-sm">
          <Button variant="link" className="flex h-auto items-center gap-1 p-0 text-white">
            <Phone className="h-4 w-4" /> 0812-3456-7890
          </Button>
          <Button
            variant="link"
            className="hidden h-auto items-center gap-1 p-0 text-white sm:flex"
          >
            <Mail className="h-4 w-4" /> myrakitanid@gmail.com
          </Button>
        </div>

        {/* CENTER */}
        <p className="min-w-0 flex-1 truncate text-center text-sm">
          Ikuti Kami dan Dapatkan Diskon Hingga 80%
        </p>

        {/* RIGHT */}
        <div className="flex flex-shrink-0 items-center justify-center gap-1 text-sm sm:justify-end">
          <p className="whitespace-nowrap">Ikuti Kami:</p>
          <Button variant="link" size="icon">
            <Instagram />
          </Button>
          <Button variant="link" size="icon">
            <YouTube />
          </Button>
          <Button variant="link" size="icon">
            <Facebook />
          </Button>
          <Button variant="link" size="icon">
            <XformerlyTwitter />
          </Button>
        </div>
      </div>
    </div>
  );
}

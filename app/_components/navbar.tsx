'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gpu, Hammer, Keyboard, LucideLogIn, Menu, PcCase, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import useIsMobile from '@/hooks/use-is-mobile';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { authClient } from '@/lib/auth-client';
import { UserDropdown } from '@/components/user-dropdown';
import { CartDrawer } from './cart-drawer';
import { CustomPcDrawer } from './custom-pc-drawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const components = [
  {
    title: 'Rakit Komputer Custom',
    href: '/pc-custom',
    description:
      'Ciptakan komputer impian Anda dengan spesifikasi yang sepenuhnya dapat disesuaikan.',
    icon: <Hammer size={18} />,
  },
  {
    title: 'PC Rakitan Siap Pakai',
    href: '/products?type=prebuilt',
    description: 'Komputer siap pakai yang dirancang dengan performa terbaik.',
    icon: <PcCase size={18} />,
  },
  {
    title: 'Komponen PC',
    href: '/products?type=component',
    description: 'Berbagai komponen berkualitas tinggi untuk meningkatkan performa PC.',
    icon: <Gpu size={18} />,
  },
  {
    title: 'Aksesoris PC',
    href: '/products?type=accessory',
    description: 'Aksesoris terbaik untuk melengkapi PC Anda.',
    icon: <Keyboard size={18} />,
  },
];

export function NavBar() {
  const isMobile = useIsMobile();
  const { data: session, isPending } = authClient.useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-background w-full border-b">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between px-4 py-3 sm:px-6">
          {/* LEFT */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {isMobile && (
              <button
                className="hover:bg-accent flex-shrink-0 rounded-md p-2"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            <Link href="/" className="flex-shrink-0">
              <h3 className="xs:text-base truncate text-sm font-semibold tracking-tight sm:text-xl md:text-2xl">
                MyRakitan.id
              </h3>
            </Link>

            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList className="flex-wrap gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/">Beranda</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Toko</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[350px] gap-2 sm:w-[450px] md:grid-cols-2 lg:w-[600px]">
                        {components.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            href={item.href}
                            icon={item.icon}
                          >
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/tentang-kami">Tentang Kami</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/kontak">Kontak</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/faq">FAQ</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {!isMobile && <ModeToggle />}
          </div>

          {/* RIGHT */}
          <div className="mt-2 flex flex-shrink-0 items-center gap-3 sm:mt-0">
            {isPending ? null : session ? (
              <UserDropdown session={session} />
            ) : (
              <Button variant="outline" asChild className="flex-shrink-0">
                <Link href="/login" className="flex items-center gap-2 whitespace-nowrap">
                  <LucideLogIn size={16} /> Masuk / Daftar
                </Link>
              </Button>
            )}

            {session?.user.role !== 'admin' && <CartDrawer />}
            {session && session.user.role !== 'admin' && <CustomPcDrawer />}
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-[9999] bg-black/40 transition-opacity ${drawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className={`bg-background absolute top-0 left-0 h-full w-72 p-6 shadow-xl transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Menu</h3>
              <button
                className="hover:bg-accent rounded-md p-2"
                onClick={() => setDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ModeToggle />

            <div className="mt-6 space-y-2">
              <Link href="/" className="block py-2 text-lg" onClick={() => setDrawerOpen(false)}>
                Beranda
              </Link>

              <Accordion type="single" collapsible>
                <AccordionItem value="toko">
                  <AccordionTrigger className="text-lg">Toko</AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 space-y-3 pl-3">
                      {components.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="flex items-center gap-2 py-1 text-base"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {item.icon} {item.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link
                href="/tentang-kami"
                className="block py-2 text-lg"
                onClick={() => setDrawerOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href="/kontak"
                className="block py-2 text-lg"
                onClick={() => setDrawerOpen(false)}
              >
                Kontak
              </Link>
              <Link href="/faq" className="block py-2 text-lg" onClick={() => setDrawerOpen(false)}>
                FAQ
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ListItem({
  title,
  children,
  href,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="mb-1 flex items-center gap-3">
            {icon} <div className="text-sm font-medium">{title}</div>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

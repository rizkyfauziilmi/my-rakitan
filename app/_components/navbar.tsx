'use client';

import { Button } from '@/components/ui/button';
import { Gpu, Hammer, Keyboard, LucideLogIn, Menu, PcCase } from 'lucide-react';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';

const components: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: 'Rakit Komputer Custom',
    href: '/pc-custom',
    description:
      'Ciptakan komputer impian Anda dengan spesifikasi yang sepenuhnya dapat disesuaikan.',
    icon: <Hammer />,
  },
  {
    title: 'PC Rakitan Siap Pakai',
    href: '/products?type=prebuilt',
    description:
      'Pilihan komputer siap pakai yang dirancang untuk memenuhi kebutuhan Anda dengan performa terbaik.',
    icon: <PcCase />,
  },
  {
    title: 'Komponen PC',
    href: '/products?type=component',
    description:
      'Temukan berbagai komponen berkualitas tinggi untuk meningkatkan performa PC Anda.',
    icon: <Gpu />,
  },
  {
    title: 'Aksesoris PC',
    href: '/products?type=accessory',
    description: 'Lengkapi kebutuhan PC Anda dengan aksesoris terbaik dari kami.',
    icon: <Keyboard />,
  },
];

export function NavBar() {
  const isMobile = useIsMobile();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="block md:hidden">
          <Link href="/">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">MyRakitan.id</h3>
          </Link>
        </div>
        <div className="hidden items-center gap-12 md:flex">
          <Link href="/">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">MyRakitan.id</h3>
          </Link>
          <div className="flex gap-2">
            <NavigationMenu viewport={isMobile}>
              <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Beranda</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Toko</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          icon={component.icon}
                        >
                          {component.description}
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
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isPending ? null : session ? (
            <UserDropdown session={session} />
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">
                <LucideLogIn /> Masuk
              </Link>
            </Button>
          )}
          {session?.user.role !== 'admin' && <CartDrawer />}
          {session && session.user.role !== 'admin' && <CustomPcDrawer />}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Jelajahi berbagai bagian situs melalui menu navigasi ini.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-2 p-4">
                <ModeToggle isFull />
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/">Beranda</Link>
                </Button>

                <Accordion type="single" collapsible>
                  <AccordionItem value="toko">
                    <AccordionTrigger className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border p-2 shadow-xs">
                      Toko
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-2 space-y-3 pl-3">
                        {components.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-2 py-1 text-base"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon} {item.title}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/tentang-kami">Tentang Kami</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/kontak">Kontak</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/faq">FAQ</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="mb-1 flex items-center gap-3">
            {icon && icon}
            <div className="text-sm leading-none font-medium">{title}</div>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Gpu, Hammer, Keyboard, LucideLogIn, PcCase } from 'lucide-react';
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

  return (
    <nav className="bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-12">
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
                <LucideLogIn /> Masuk / Daftar
              </Link>
            </Button>
          )}
          {session?.user.role !== 'admin' && <CartDrawer />}
          {session && session.user.role !== 'admin' && <CustomPcDrawer />}
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

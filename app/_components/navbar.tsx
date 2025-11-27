'use client';

import { Button } from '@/components/ui/button';
import { Bookmark, Gpu, Hammer, Keyboard, LucideLogIn, PcCase, ShoppingCart } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';
import { authClient } from '@/lib/auth-client';
import { UserDropdown } from '@/components/user-dropdown';

const components: {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: 'Rakit Komputer Custom',
    href: '/rakit-komputer-custom',
    description:
      'Ciptakan komputer impian Anda dengan spesifikasi yang sepenuhnya dapat disesuaikan.',
    icon: <Hammer />,
  },
  {
    title: 'PC Rakitan',
    href: '/pc-rakitan',
    description:
      'Pilihan komputer siap pakai yang dirancang untuk memenuhi kebutuhan Anda dengan performa terbaik.',
    icon: <PcCase />,
  },
  {
    title: 'Komponen PC',
    href: '/komponen-pc',
    description:
      'Temukan berbagai komponen berkualitas tinggi untuk meningkatkan performa PC Anda.',
    icon: <Gpu />,
  },
  {
    title: 'Aksesoris PC',
    href: '/aksesoris-pc',
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
          <ButtonCounter icon={<ShoppingCart />} count={2} />
          <ButtonCounter icon={<Bookmark />} count={5} />
        </div>
      </div>
    </nav>
  );
}

function ButtonCounter({
  icon,
  count,
  variant = 'default',
}: {
  icon: React.ReactNode;
  count: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
}) {
  return (
    <Button variant="outline" size="icon" className="relative rounded-full">
      {icon}
      <CountItemBadge count={count} variant={variant} />
    </Button>
  );
}

function CountItemBadge({
  count,
  variant = 'default',
}: {
  count: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined;
}) {
  return (
    <Badge
      variant={variant}
      className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
    >
      {count}
    </Badge>
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

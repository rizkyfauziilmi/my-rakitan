import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Topbar } from './_components/topbar';
import Footer from './_components/footer';
import { Open_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/server/trpc/client';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rakitin ID',
  description: 'Platform untuk merakit PC custom dengan mudah dan cepat di Indonesia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <html lang="id" className={openSans.className} suppressHydrationWarning>
          <head />
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Topbar />
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}

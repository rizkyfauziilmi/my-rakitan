export function MainLayout({ children }: { children: React.ReactNode }) {
  return <main className="container mx-auto min-h-screen p-4 md:px-2 md:py-8">{children}</main>;
}

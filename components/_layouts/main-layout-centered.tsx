export function MainLayoutCentered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:py-6">{children}</main>
  );
}

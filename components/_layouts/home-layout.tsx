export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="from-primary/30 to-secondary/50 min-h-screen rounded-md bg-linear-to-r p-6 pb-8 md:mx-8 md:mt-12">
      {children}
    </main>
  );
}

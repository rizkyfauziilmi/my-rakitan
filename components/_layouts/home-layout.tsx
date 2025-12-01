export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="from-primary/30 to-secondary/50 mx-8 mt-12 min-h-screen rounded-md bg-linear-to-r p-6 pb-8">
      {children}
    </main>
  );
}

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-8 pb-8 mt-12 rounded-md bg-linear-to-r min-h-screen from-primary/30 to-secondary/50">
      {children}
    </main>
  );
}

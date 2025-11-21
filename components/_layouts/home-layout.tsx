export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-6 rounded-md bg-linear-to-r min-h-screen from-[#96E9FB] to-[#ABECD6]">
      {children}
    </main>
  );
}

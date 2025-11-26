export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full p-6 flex justify-center items-center min-h-screen">
      {children}
    </div>
  );
}

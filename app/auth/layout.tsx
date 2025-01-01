export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white ">
      {children}
    </div>
  );
}
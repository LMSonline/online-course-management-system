import Navbar from "@/core/components/public/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[72vh]">{children}</main>
    </>
  );
}

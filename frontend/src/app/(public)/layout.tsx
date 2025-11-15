// app/(public)/layout.tsx
import Navbar from "@/core/components/layout/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[72vh]">{children}</main>
      {/* Footer đã ở RootLayout rồi, không cần lặp lại */}
    </>
  );
}

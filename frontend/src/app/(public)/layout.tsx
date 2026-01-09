import Footer from "@/core/components/public/Footer";
import Navbar from "@/core/components/public/Navbar";

/**
 * PublicLayout - No guard required
 * Used for public/SEO routes: /, /courses, /categories, etc.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[72vh]">{children}</main>
      <Footer />
    </>
  );
}

import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "LMS – Online Courses Learning",
  description: "Learn anything with LMS. Online courses and learning paths.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <main className="min-h-[72vh]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
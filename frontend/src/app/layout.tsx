import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import AssistantWidget from "@/core/components/public/AssistantWidget";
import Footer from "@/core/components/public/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "LMS – Online Courses Learning",
  description: "Learn anything with LMS. Online courses and learning paths.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ToastProvider>
            {children}
            <AssistantWidget />
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

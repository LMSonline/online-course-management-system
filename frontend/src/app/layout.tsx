import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import AssistantWidget from "@/core/components/public/AssistantWidget";
import { ReactQueryProvider } from "@/lib/providers/ReactQueryProvider";
import { ToasterProvider } from "@/lib/providers/ToasterProvider";

import Footer from "@/core/components/public/Footer";

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
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <ToasterProvider />
            {children}
            <AssistantWidget />
            <Footer />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

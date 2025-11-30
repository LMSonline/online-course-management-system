// app/layout.tsx
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import AssistantWidget from "@/core/components/public/AssistantWidget";

import Footer from "@/core/components/layout/Footer";

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
          {/* Header sẽ do từng layout con (public/learner/...) quyết định */}
          {children}
          <AssistantWidget />
          {/* Footer dùng chung cho toàn bộ app */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

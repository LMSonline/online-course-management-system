import "../styles/globals.css";
import { ThemeProvider } from "@/core/providers/theme-provider";
import type { Metadata } from "next";
import AssistantWidget from "@/core/components/public/AssistantWidget";
import { ReactQueryProvider } from "@/lib/providers/ReactQueryProvider";
import { ToasterProvider } from "@/lib/providers/ToasterProvider";
import { AuthBootstrapGate } from "@/components/auth/AuthBootstrapGate";

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
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterProvider />
            <AuthBootstrapGate>
              {children}
            </AuthBootstrapGate>
            <AssistantWidget />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { StoreProvider } from "@/context/StoreContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "JustGoDev • Live Demo",
  description:
    "Next-Gen Cloud E-Commerce & Online Retail Marketplace Suite by JustGoDev - Multilingual (Lao, Thai, English) with Realtime LocalStorage Sandbox",
  icons: {
    icon: "/jgd-latets-logo.png",
    shortcut: "/jgd-latets-logo.png",
    apple: "/jgd-latets-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <ToastProvider>
          <ThemeProvider>
            <LanguageProvider>
              <StoreProvider>{children}</StoreProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

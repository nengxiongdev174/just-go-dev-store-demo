import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JustGoDev • Live Demo",
  description: "Next-Gen E-Commerce & Retail Store Suite by JustGoDev",
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
      <body className="antialiased min-h-screen bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

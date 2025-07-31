// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Sonner for toast notifications
import { Navbar } from "@/components/shared/Navbar"; // Navbar with cart integration

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "A modern e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {/* Top Navbar with logo and cart */}
        <Navbar />

        {/* Main content of the page */}
        <main>{children}</main>

        {/* Sonner toast notifications */}
        <Toaster richColors />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KYROZ-PLUS | AI-Powered Restaurant Operating System",
  description: "Standardize your kitchen, control food costs, and scale your restaurant with KYROZ Chef.",
};

import { CartProvider } from "@/context/CartContext";
import FloatingCart from "@/components/ui/FloatingCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}

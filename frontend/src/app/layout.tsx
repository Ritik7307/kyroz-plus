import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KYROZ-PLUS | AI-Powered Restaurant Operating System",
  description: "Standardize your kitchen, control food costs, and scale your restaurant with KYROZ Chef.",
  manifest: "/manifest.json",
};

import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import FloatingCart from "@/components/ui/FloatingCart";
import FacebookSdk from "@/components/ui/FacebookSdk";
import InputSanitizer from "@/components/ui/InputSanitizer";
import { Metadata } from "next";

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
        <ThemeProvider>
          <InputSanitizer />
          <CartProvider>
            {children}
            <FloatingCart />
          </CartProvider>

          {/* Facebook SDK for WhatsApp Embedded Signup */}
          <FacebookSdk />
        </ThemeProvider>
      </body>
    </html>
  );
}

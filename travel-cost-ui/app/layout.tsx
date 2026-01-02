import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travello by Pranto",
  description: "Manage your trip expenses easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      {/* 2. And add it here as well */}
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
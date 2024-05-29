import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Modal } from "@/context/web3-modal";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "./components/navbar";

// const inter = Inter({ subsets: ["latin"] });

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Blockchain HW",
  description: "Blockchain Homework 6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Web3Modal>
          <Navbar />
          {children}
          <Toaster />
        </Web3Modal>
      </body>
    </html>
  );
}

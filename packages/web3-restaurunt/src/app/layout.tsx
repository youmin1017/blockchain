import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Navbar } from "./_components/navbar";
import { Web3Modal } from "@/components/web3-model";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Web3 Restaurant",
  description: "Web3 Restaurant Demo",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fontSans.variable)}>
      <body>
        <TRPCReactProvider>
          <Web3Modal>
            <div id="app" className="flex h-screen flex-col">
              <Navbar />
              {children}
            </div>
            <Toaster />
          </Web3Modal>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

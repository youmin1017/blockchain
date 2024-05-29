"use client";
// import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useWeb3Modal, useWalletInfo } from "@web3modal/ethers/react";
import { VRFDemo } from "./components/vrf-demo";

export default function Home() {
  console.log(process.env.PROJECT_ID);
  return (
    <main className="m-4">
      <div className="flex gap-4">
        <VRFDemo />
      </div>
    </main>
  );
}

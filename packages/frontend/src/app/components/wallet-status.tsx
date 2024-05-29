"use client";

import { Button } from "@/components/ui/button";
import { useDisconnect, useWalletInfo, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";

export function WalletStatus() {
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="font-bold">Connected Account: {address}</div>
        <Image src={walletInfo?.icon ?? ""} alt={walletInfo?.name ?? "WalletIcon"} width={20} height={20} />
        <div className="font-bold">{walletInfo?.name}</div>
        <Button variant={"outline"} onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  } else {
    return (
      <div className="">
        <Button onClick={() => open()}>Connect to wallet</Button>
      </div>
    );
  }
}

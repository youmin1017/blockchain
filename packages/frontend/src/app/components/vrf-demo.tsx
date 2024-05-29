"use client";

import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useToast } from "@/components/ui/use-toast";

import { VRFD20_ABI } from "./vrf-abi";
import { Button } from "@/components/ui/button";
import { BrowserProvider, Contract } from "ethers";

const VRFD20_ADDRESS = "0x88809C7c48513F8b429777d1d5773fB2b8B529E1";

enum VRFD20_METHODS {
  owner = "owner",
  rollDice = "rollDice",
  house = "house",
}

export function VRFDemo() {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  async function interactVRFD20(action: VRFD20_METHODS) {
    if (!isConnected) {
      toast({ title: "Please Connect To Wallet Before", description: "...", variant: "destructive" });
      return;
    }

    if (walletProvider === undefined) {
      toast({ title: "Wait for wallet provider", description: "...", variant: "destructive" });
      return;
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const vrfd20 = new Contract(VRFD20_ADDRESS, VRFD20_ABI, signer);

    switch (action) {
      case VRFD20_METHODS.owner:
        const owner = await vrfd20.owner();
        toast({ title: "Owner", description: owner });
        break;
      case VRFD20_METHODS.rollDice:
        await vrfd20.rollDice();
        toast({ title: "Roll Dice", description: "Rolling Dice" });
        break;
      case VRFD20_METHODS.house:
        const horse = await vrfd20.house(address);
        toast({ title: "Horse", description: horse });
        break;
    }
  }

  return (
    <main className="m-4">
      <h1 className="text-xl font-semibold mb-3">Interact With Contract</h1>
      <div className="flex gap-4">
        <Button onClick={() => interactVRFD20(VRFD20_METHODS.owner)}>Get Owner</Button>
        <Button disabled onClick={() => interactVRFD20(VRFD20_METHODS.rollDice)}>
          Roll Dice
        </Button>
        <Button onClick={() => interactVRFD20(VRFD20_METHODS.house)}>Get House</Button>
      </div>
    </main>
  );
}

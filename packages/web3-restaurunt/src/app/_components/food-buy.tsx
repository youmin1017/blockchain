"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";

import { selectedCouponAtom } from "../coupon/_components/use-coupon";
import { useAtomValue } from "jotai";
import { RESTAURANT_ABI } from "@/abi/restaurant";
import { env } from "@/env";
import { useSeat } from "@/components/use-seat";
import { useRouter } from "next/navigation";

export function FoodBuy({
  foodId,
  foodPrice,
}: {
  foodId: number;
  foodPrice: number;
}) {
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const router = useRouter();
  const { toast } = useToast();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [seat] = useSeat();

  async function buyFood() {
    if (walletProvider === undefined) {
      return;
    }
    if (!isConnected) {
      toast({
        title: "Please Connect To Wallet Before",
        description: "...",
        variant: "destructive",
      });
      return;
    }

    if (seat === null) {
      toast({
        title: "Please Select Seat",
        description: "...",
        variant: "destructive",
      });
      return;
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const couponNft = new Contract(
      env.NEXT_PUBLIC_RESTAURANT_NFT_ADDRESS,
      RESTAURANT_ABI,
      signer,
    );

    if (selectedCoupon === "0") {
      await couponNft.bookSeat(seat, foodId, {
        value: ethers.parseEther(foodPrice.toString()),
      });
    } else {
      const newPrice =
        selectedCoupon === "1"
          ? foodPrice * 0.7
          : selectedCoupon === "2"
            ? foodPrice * 0.6
            : foodPrice * 0.5;
      await couponNft.bookSeatWithCoupon(seat, foodId, selectedCoupon, {
        value: ethers.parseEther(newPrice.toString()),
      });
    }
    router.refresh();
  }

  return (
    <div>
      <Button onClick={buyFood}>Buy</Button>
    </div>
  );
}

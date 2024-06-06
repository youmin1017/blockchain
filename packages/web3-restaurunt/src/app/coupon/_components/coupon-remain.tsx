"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { COUPON_ABI } from "@/abi/coupon-abi";
import { useAtom } from "jotai";
import { couponValuesAtom } from "./use-coupon";

interface CouponRemainProps {
  tokenId: string;
}

export function CouponRemain({ tokenId }: CouponRemainProps) {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [couponValues, setCouponValues] = useAtom(couponValuesAtom);

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "請先連接錢包",
        description: "...",
        variant: "destructive",
      });
      return;
    }
    if (walletProvider === undefined) {
      toast({
        title: "Wait for wallet provider",
        description: "...",
        variant: "destructive",
      });
      return;
    }
  }, [address]);

  async function getRemain() {
    if (!isConnected) {
      toast({
        title: "Please Connect To Wallet Before",
        description: "...",
        variant: "destructive",
      });
      return;
    }

    if (walletProvider === undefined) {
      toast({
        title: "Wait for wallet provider",
        description: "...",
        variant: "destructive",
      });
      return;
    }

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const couponNft = new Contract(
      env.NEXT_PUBLIC_COUPON_NFT_ADDRESS,
      COUPON_ABI,
      signer,
    );

    const _remain = await couponNft.balanceOf(signer.address, tokenId);
    setCouponValues((prev) => ({
      ...prev,
      [tokenId]: _remain.toString(),
    }));
  }

  if (!isConnected || walletProvider === undefined) {
    return <div>請先連接錢包</div>;
  }

  if (couponValues[tokenId] == null) {
    return (
      <div>
        <Button onClick={getRemain}>
          <p>取得剩餘數量</p>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant={"ghost"} onClick={getRemain}>
        剩餘數量：{couponValues[tokenId]}
      </Button>
    </div>
  );
}

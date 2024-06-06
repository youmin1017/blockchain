"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useToast } from "@/components/ui/use-toast";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import { COUPON_ABI } from "@/abi//coupon-abi";
import { env } from "@/env";

const formSchema = z.object({
  tokenId: z.coerce.number().positive(),
  to: z.string().length(42),
  amount: z.coerce.number().positive(),
});

export function CouponForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenId: 0,
      to: "",
      amount: 0,
    },
  });

  const { toast } = useToast();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
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

    const isAdmin = await couponNft.hasRole(
      keccak256(toUtf8Bytes("ADMIN_ROLE")),
      signer,
    );
    if (!isAdmin) {
      toast({
        title: "You are not admin",
        description: "...",
        variant: "destructive",
      });
      return;
    }

    couponNft.safeTransferFrom(
      signer,
      values.to,
      values.tokenId,
      values.amount,
      "0x",
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token ID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <Input placeholder="0x00..00" {...field} />
              </FormControl>
              <FormDescription>發送優惠券給</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

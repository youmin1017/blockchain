"use client";

import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { env } from "@/env";
import { RESTAURANT_ABI } from "@/abi/restaurant";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { useSeat } from "./use-seat";

export function Seats() {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [seats, setSeats] = useState(null);
  const [seat, setSeat] = useSeat();

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Please Connect To Wallet Before",
        description: "...",
        variant: "destructive",
      });
      return;
    }
  }, []);

  async function loadSeats() {
    if (walletProvider === undefined) {
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
    let res = await couponNft.getAllSeat();
    setSeats(res);
    console.log(res[1].food);
  }

  async function leaveSeat(seatNumber: number) {
    if (walletProvider === undefined) {
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
    let res = await couponNft.leaveSeat(seatNumber);
  }

  if (seats === null) {
    return (
      <div>
        <Button onClick={loadSeats}>Click to load seats</Button>
      </div>
    );
  }

  return (
    <div className="flex w-full grow flex-wrap overflow-auto">
      <Table>
        <TableCaption>餐聽座位列表</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead className="w-[100px]">座號</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Food</TableHead>
            <TableHead>Leave</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seats.map((s, i) => {
            const status = Number(s.customer) !== 0 ? "Eating" : "Empty";
            return (
              <TableRow
                key={i}
                onClick={() => {
                  if (Number(s.customer) != 0) {
                    return;
                  }
                  setSeat(i);
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={seat == i}
                    disabled={Number(s.customer) != 0}
                  />
                </TableCell>
                <TableCell className="font-medium">{i}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>{s.customer}</TableCell>
                <TableCell className="text-right">{s.food}</TableCell>
                <TableCell>
                  {status === "Eating" ? (
                    <Button onClick={() => leaveSeat(i)}>Leave</Button>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

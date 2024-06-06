"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDisconnect,
  useWalletInfo,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import Image from "next/image";
import Link from "next/link";

export function Wallet() {
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <WalletStatus
              icon={walletInfo?.icon}
              name={walletInfo?.name}
              address={address}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/coupon">Coupon</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnect}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

function WalletStatus({
  className,
  icon,
  name,
  address,
}: {
  className?: string;
  icon?: string;
  name?: string;
  address?: string;
}) {
  return (
    <div className={className}>
      <Button variant={"ghost"} className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Image
            src={icon ?? ""}
            alt={name ?? "WalletIcon"}
            width={20}
            height={20}
          />
          <div className="font-bold">{name}</div>
        </div>
        <div className="font-bold">
          {address?.substring(0, 6)}...{address?.substring(38)}
        </div>
      </Button>
    </div>
  );
}

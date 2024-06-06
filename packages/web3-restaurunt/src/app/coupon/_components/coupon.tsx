import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import Image from "next/image";
import { CouponRemain } from "./coupon-remain";
import { CouponSelector } from "./coupon-selector";

interface CouponProps {
  className?: string;
  tokenId: string;
}

export async function Coupon({ className, tokenId }: CouponProps) {
  const metatdata = await api.coupon.getMetadata({ tokenId });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{metatdata.name}</CardTitle>
        <CardDescription>{metatdata.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={metatdata.image}
          alt={metatdata.name}
          width={400}
          height={100}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <CouponRemain tokenId={tokenId} />
        <CouponSelector tokenId={tokenId} />
      </CardFooter>
    </Card>
  );
}

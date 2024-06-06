"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Switch } from "@/components/ui/switch";
import {
  couponValuesAtom,
  selectedCouponAtom,
  updateSelectedCouponAtom,
} from "./use-coupon";

export function CouponSelector({ tokenId }: { tokenId: string }) {
  const couponValues = useAtomValue(couponValuesAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const setSelectedCoupon = useSetAtom(updateSelectedCouponAtom);
  return (
    <Switch
      disabled={couponValues[tokenId] === null || couponValues[tokenId] <= 0}
      checked={selectedCoupon === tokenId}
      value={selectedCoupon === tokenId ? "on" : "off"}
      onCheckedChange={(checked) => {
        setSelectedCoupon(checked ? tokenId : "0");
      }}
    />
  );
}

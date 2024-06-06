import { atom } from "jotai";

export const selectedCouponAtom = atom("0");
export const couponValuesAtom = atom({
  "0": null,
  "1": null,
  "2": null,
});

export const updateSelectedCouponAtom = atom(
  null,
  (get, set, tokenId: string) => {
    if (!(tokenId == "0" || tokenId == "1" || tokenId == "2" || tokenId == "3")) {
      return;
    }
    const num = get(couponValuesAtom)[tokenId];
    set(selectedCouponAtom, tokenId);
  },
);

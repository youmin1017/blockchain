import { atom, useAtom } from "jotai";

export const seatAtom = atom<null|number>(null);

export function useSeat() {
  return useAtom(seatAtom);
}

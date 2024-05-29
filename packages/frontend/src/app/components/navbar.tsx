import { WalletStatus } from "./wallet-status";

export function Navbar() {
  return (
    <div className="h-10 flex justify-between items-center mx-5 mt-3">
      <div className="text-2xl">Blockchain Homework 5&6</div>
      <WalletStatus />
    </div>
  );
}

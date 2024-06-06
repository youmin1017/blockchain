import Link from "next/link";
import { Wallet } from "./wallet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 shadow-sm">
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "text-lg font-semibold",
        )}
        href="/"
      >
        WEB3 Restaurant
      </Link>
      <div className="flex gap-4">
        <Wallet />
      </div>
    </nav>
  );
}

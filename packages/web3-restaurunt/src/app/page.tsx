import Link from "next/link";
import Image from "next/image";

import { api } from "@/trpc/server";
import { env } from "@/env";
import { Seats } from "@/components/seats";
import { Menu } from "./_components/menu";

export default async function Home() {
  return (
    <main className="mx-4 flex gap-2">
      <div className="flex-1">
        <Seats />
      </div>
      <div className="flex-1 m-2">
        <Menu />
      </div>
    </main>
  );
}

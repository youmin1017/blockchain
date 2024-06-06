import { z } from "zod";
import axios from "axios";
import { env } from "@/env";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const CouponMetadata = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  external_url: z.string(),
  attributes: z.array(z.object({ trait_type: z.string(), value: z.string() })),
});

export const couponRouter = createTRPCRouter({
  getMetadata: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      const res = await axios({
        method: "get",
        url: `https://ipfs.io/ipfs/QmQQqWxt5Q6C7zY1PMrkSZgfWc58iivLyLKCAZdabvuNMB/${input.tokenId}.json`,
        headers: {},
      });
      const metadata = CouponMetadata.parse(res.data);
      return metadata;
    }),
  getContractAddress: publicProcedure.query(async () => {
    return env.NEXT_PUBLIC_COUPON_NFT_ADDRESS;
  }),
});

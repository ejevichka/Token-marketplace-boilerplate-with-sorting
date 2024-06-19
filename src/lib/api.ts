import * as z from "zod";
import { EVMAddress } from "~/domains/evm";

const API_URL = "https://li.quest/v1/tokens";

// @todo find this model in LIFI codebase
export const TokenSchema = z.object({
  address: EVMAddress,
  chainId: z.number(), // TODO EVMChainId gives error "Expected string, received number"
  coinKey: z.string().optional(),
  decimals: z.number(),
  logoURI: z.string().optional(),
  name: z.string(),
  priceUSD: z.string(),
  symbol: z.string(),
});

export type TToken = z.infer<typeof TokenSchema>;

export const TokenFilterSchema = z.object({
  chainId: z.number(),
  chainType: z.string(),
});

export type TTokenFilter = z.infer<typeof TokenFilterSchema>;

export const fetchTokens = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch tokens: ${res.statusText}`);
  }
  const data = await res.json();
  const tokenData = data.tokens;
  const tokensArray = Object.values(tokenData).flat().map((x) => TokenSchema.parse(x)) as TToken[];
  return tokensArray;
};
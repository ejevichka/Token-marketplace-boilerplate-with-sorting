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
const allTokensPromise = fetchAllTokens();

export const fetchTokens = async (
  page: number,
  limit: number,
  filter: TTokenFilter,
): Promise<TToken[]> => {
  try {
    const response = await allTokensPromise;
    const offset = page * limit;
    return response.slice(offset, offset + limit);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};




export async function fetchAllTokens() {
  const response = await fetch(API_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to tokens, received status ${response.status}`);
  }

  return Object.values(data.tokens)
    .flat()
    .map((x) => TokenSchema.parse(x));
}

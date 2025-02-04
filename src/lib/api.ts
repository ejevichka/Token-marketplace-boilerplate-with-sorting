import * as z from "zod";
import { EVMAddress } from "~/domains/evm";
import {ExtendedChain} from "@lifi/types";

const API_URL = "https://li.quest/v1/tokens";
const CHAIN_API_URL = 'https://li.quest/v1/chains';


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
  chainType: z.string().optional()
});

export type TToken = z.infer<typeof TokenSchema>;

export const TokenFilterSchema = z.object({
  chainId: z.number(),
  chainType: z.string(),
});

export type TTokenFilter = z.infer<typeof TokenFilterSchema>;

const fetchChainData = async (): Promise<{ [key: number]: string }> => {
  const res = await fetch(`${CHAIN_API_URL}?chainTypes=EVM%2CSVM`);
  if (!res.ok) {
    throw new Error(`Failed to fetch chain data: ${res.statusText}`);
  }
  const data = await res.json();
  const chainData: ExtendedChain[] = data.chains;

  const chainTypeMapping: { [key: number]: string } = {};
  chainData.forEach((chain) => {
    chainTypeMapping[chain.id] = chain.chainType;
  });

  return chainTypeMapping;
};

export const fetchTokens = async (): Promise<TToken[]> => {
  const chainTypeMapping = await fetchChainData();

  const res = await fetch(`${API_URL}?chainTypes=EVM%2CSVM`);  // By default API returns only EVM tokens
  if (!res.ok) {
    throw new Error(`Failed to fetch tokens: ${res.statusText}`);
  }
  const data = await res.json();
  const tokenData = data.tokens;

  const tokensArray: TToken[] = Object.entries(tokenData).flatMap(([chainId, tokens]: [string, any]) => {
    return tokens.map((token: any) => ({
      ...token,
      chainType: chainTypeMapping[parseInt(chainId, 10)] || 'Unknown',
    }));
  });

  return tokensArray;
};
import axios from 'axios';
import * as z from 'zod';
import { EVMAddress } from "~/domains/evm";

const API_URL = 'https://li.quest/v1/tokens';

const TokenSchema = z.object({
    address: EVMAddress,
    chainId:  z.number(), // TODO EVMChainId gives error "Expected string, received number"
    coinKey: z.string().optional(),
    decimals: z.number(),
    logoURI: z.string().optional(),
    name: z.string(),
    priceUSD: z.string(),
    symbol: z.string(),
  });

export type TToken = z.infer<typeof TokenSchema>;

export const fetchTokens = async (page: number, limit: number, chains = '', chainTypes = ''): Promise<TToken[]> => {
  const params: any = {
    limit,
    offset: page * limit,
  };

  if (chains) {
    params.chains = chains;
  }

  if (chainTypes) {
    params.chainTypes = chainTypes;
  }

  try {
    const response = await axios.get(API_URL, { params });
    const data = response.data;
    const tokensArray = Object.values(data.tokens).flat(); // Flatten the nested structure
    // Validate the tokensArray using the TokenSchema
    const validatedTokensArray = tokensArray.map((token: any) => TokenSchema.parse(token));

    return validatedTokensArray;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

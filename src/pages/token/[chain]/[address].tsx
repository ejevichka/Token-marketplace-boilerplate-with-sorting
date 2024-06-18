import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState, useEffect } from 'react';
import cache from '~/utils/cache';
import { TToken } from '~/lib/api';

type TokenDetailPageProps = {
  token: {
    chain: number;
    address: string;
    logoURI: string;
    tokenName: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch('https://li.quest/v1/tokens');
    if (!res.ok) {
      throw new Error(`Failed to fetch tokens: ${res.statusText}`);
    }
    const data = await res.json();
    const tokenData = data.tokens;
    const tokensArray = Object.values(tokenData).flat() as TToken[];

    // Generate paths for a subset of tokens, e.g., the first 100 tokens
    const paths = tokensArray.slice(0, 100).map((token) => ({
      params: {
        chain: token.chainId.toString(),
        address: token.address,
      },
    }));

    return {
      paths,
      fallback: 'blocking', // ISR
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      paths: [],
      fallback: 'blocking', // ISR
    };
  }
};

export const getStaticProps: GetStaticProps<TokenDetailPageProps> = async ({ params }) => {
  try {
    const { chain, address } = params as { chain: string; address: string };
    const res = await fetch('https://li.quest/v1/tokens');
    if (!res.ok) {
      throw new Error(`Failed to fetch tokens: ${res.statusText}`);
    }
    const data = await res.json();
    const tokenData = data.tokens;
    const tokensArray: TToken[] = Object.values(tokenData).flat() as TToken[];
    const token = tokensArray.find(
      (t) => t.chainId.toString() === chain && t.address === address
    );

    if (!token) {
      return { notFound: true };
    }

    return {
      props: {
        token: {
          chain: token.chainId,
          address: token.address,
          logoURI: token.logoURI || '/default-logo.png',
          tokenName: token.name,
        },
      },
      revalidate: 60, // ISR
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    return { notFound: true };
  }
};

const TokenDetailPage = ({ token }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { chain, address, logoURI, tokenName } = token;
  const [isFavorite, setIsFavorite] = useState(false);

   useEffect(() => {
    const favoriteTokens = cache.get('favoriteTokens') || new Set();
    const isFav = favoriteTokens.has(address);
    setIsFavorite(isFav);
  }, [address]);

  const handleFavoriteClick = () => {
    const favoriteTokens = cache.get('favoriteTokens') || new Set();
    if (favoriteTokens.has(address)) {
      favoriteTokens.delete(address);
    } else {
      favoriteTokens.add(address);
    }
    cache.set('favoriteTokens', favoriteTokens);
    setIsFavorite(!isFavorite);
  };

  return (
    <div>
      <h1>{tokenName}</h1>
      <img src={logoURI} alt={tokenName} />
      <p>Address: {address}</p>
      <p>Chain ID: {chain}</p>
      <button
        onClick={handleFavoriteClick}
        className={`p-2 mt-4 ${isFavorite ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
      </button>
    </div>
  );
};

export default TokenDetailPage;

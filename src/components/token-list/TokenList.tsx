// components/TokenList.tsx
import React, { useEffect, useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import Link from 'next/link';
import { useQuery, useQueryClient } from 'react-query';
import { fetchTokens, TToken } from '~/lib/api';

const TokenList: React.FC = () => {
  const limit = 50;
  const [tokens, setTokens] = useState<TToken[]>([]);
  const [chains, setChains] = useState(''); // State for selected chains
  const [chainTypes, setChainTypes] = useState(''); // State for selected chainTypes
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const fetchTokensData = async (page: number, limit: number, chains: string, chainTypes: string) => 
    fetchTokens(page, limit, chains, chainTypes);

  const { data, error, isFetching } = useQuery(
    ['tokens', page, limit, chains, chainTypes],
    () => fetchTokensData(page, limit, chains, chainTypes),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data) {
      setTokens((prevTokens) => [...prevTokens, ...data]);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setLoading(true);
    setTokens([]);
    setPage(0);
  }, [chains, chainTypes]);

  const loadMoreTokens = () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const token: TToken | undefined = tokens[index];
    if (!token) return null;
    return (
      <div style={style} key={token.address} className="p-2 border-b">
        <Link href={`/token/${token.chainId}/${token.address}`}>
          <img src={token.logoURI} alt={token.name} width="20" height="20" />
          {token.name}
        </Link>
      </div>
    );
  };

  return (
    <div>
      <div className="controls">
        <select
          value={chains}
          onChange={(e) => setChains(e.target.value)}
          className="block w-full sm:inline-block sm:w-auto px-3 m-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Chains</option>
          <option value="1">Ethereum</option>
          <option value="137">Polygon</option>
          {/* Add other chains as needed */}
        </select>
        <select
          value={chainTypes}
          onChange={(e) => setChainTypes(e.target.value)}
          className="block w-full sm:inline-block sm:w-auto px-3 m-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Chain Types</option>
          <option value="EVM">EVM</option>
          <option value="SVM">SVM</option>
          {/* Add other chain types as needed */}
        </select>
      </div>
      <List
        key={`${chains}-${chainTypes}-${tokens.length}`} // Use key to force re-render
        height={600} // height of the list container
        itemCount={tokens.length}
        itemSize={50} // height of each item
        width="100%"
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex >= tokens.length - 1 && !loading && !isFetching) {
            loadMoreTokens(); // Load more tokens when nearing the end
          }
        }}
      >
        {Row}
      </List>
      {loading && <div>Loading more tokens...</div>}
      {error && <div>Error loading tokens: {error.message}</div>}
    </div>
  );
};

export default TokenList;

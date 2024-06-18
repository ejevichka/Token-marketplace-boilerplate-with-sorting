import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  FixedSizeList as List,
  type ListChildComponentProps,
} from "react-window";
import Link from "next/link";
import { TToken, TTokenFilter } from "~/lib/api";


const TokenList = ({ data }: { data: TToken[] }) => {

  const [filter, setFilter] = useState<TTokenFilter>({
    chainId: 1,
    chainType: "",
  });
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    console.log("filter", filter)
    return data.filter(token => {
      return (
        (!filter.chainId || token.chainId === filter.chainId) &&
        (!filter.chainType || token.coinKey === filter.chainType)
      );
    });
  }, [data, filter]);


  const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
    const token: TToken | undefined = filteredData[index];
    const router = useRouter();
    if (!token) return null;
    const handleTokenClick = () => {
      router.push({
        pathname: `/token/${token.chainId}/${token.address}`,
        query: { logoURI: token.logoURI, tokenName: token.name },
      });
    };

    return (
      <div style={style} key={token.address} className="border-b p-2">
        <div onClick={handleTokenClick} className="cursor-pointer">
          <img
            src={token.logoURI || "/default-logo.png"}
            alt={token.name}
            width="20"
            height="20"
          />
          {token.name}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="controls">
        <select
          value={filter.chainId}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              chainId: parseInt(e.target.value, 10),
            }))
          }
          className="m-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:inline-block sm:w-auto sm:text-sm"
        >
          <option value="0">Select Chains</option>
          <option value="1">Ethereum</option>
          <option value="100">MakerDAO</option>
          <option value="137">Polygon</option>
          <option value="137">Uniswap</option>       
        </select>
        <select
          value={filter.chainType}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              chainType: e.target.value,
            }))
          }
          className="m-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:inline-block sm:w-auto sm:text-sm"
        >
          <option value="">Select Chain Types</option>
          <option value="EVM">EVM</option>
          <option value="SVM">SVM</option>
        </select>
      </div>
      <List
        height={600}
        itemCount={data?.length || 0}
        itemSize={50} 
        width="100%"
        onItemsRendered={({ visibleStopIndex }) => {
          setPage((x) => x + 1);
        }}
      >
        {Row}
      </List>
     {/*  {isLoading && <div>Loading more tokens...</div>}
      {error && <div>Error loading tokens: {error.message}</div>} */}
    </div>
  );
};

export default TokenList;

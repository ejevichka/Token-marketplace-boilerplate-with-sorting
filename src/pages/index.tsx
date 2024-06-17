import TokenList from "../components/token-list/TokenList"
import { TokenSchema, TToken } from "~/lib/api";


import type { InferGetStaticPropsType, GetStaticProps } from 'next'
 
 
export const getStaticProps: GetStaticProps<{ data: TToken[] }> = async (context) => {
  try {
    const res = await fetch('https://li.quest/v1/tokens');
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(`Failed to fetch tokens, received status ${res.status}`);
    }
    
    const flatData = Object.values(data.tokens)
      .flat()
      .map((x) => TokenSchema.parse(x));

    return {
      props: {
        data: flatData
      },
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      props: {
        data: [],
      },
    };
  }
};

const HomePage = ({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
       <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Search your NFT</span></h1>
      <div>
        <TokenList data={data}/>
      </div>
    </div>
  );
};

export default HomePage;

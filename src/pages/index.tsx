import TokenList from "../components/token-list/TokenList"
import { fetchTokens, TToken } from "~/lib/api";
import type { InferGetStaticPropsType, GetStaticProps } from 'next'
 
export const getStaticProps: GetStaticProps<{ data: TToken[], error?: string }> = async () => {
  try {
    const tokensArray = await fetchTokens();

    return {
      props: {
        data: tokensArray
      },
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      props: {
        data: [],
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const HomePage = ({
  data,
  error
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
       <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Search your NFT</span></h1>
       <div>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <TokenList data={data} />
        )}
      </div>
    </div>
  );
};

export default HomePage;

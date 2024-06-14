// pages/index.tsx
import TokenList from "../components/token-list/TokenList"

const HomePage = () => {
  return (
    <div>
       <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Search your NFT</span></h1>
      <div>
        <TokenList />
      </div>
    </div>
  );
};

export default HomePage;

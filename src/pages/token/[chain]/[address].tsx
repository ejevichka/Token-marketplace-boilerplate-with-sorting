// pages/token/[chain]/[address].tsx
import { GetServerSideProps } from 'next';
import axios from 'axios';

const API_URL = 'https://li.quest/v1/tokens';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { chain, address } = params;
    const response = await axios.get(API_URL, {
      headers: { accept: 'application/json' },
    });

    const tokenData = response.data.tokens;
    const tokensArray = Object.values(tokenData).flat();
    const token = tokensArray.find((t) => t.chainId === parseInt(chain, 10) && t.address === address);

    if (!token) {
      return { notFound: true };
    }

    return {
      props: { token },
    };
  } catch (error) {
    console.error(`Error fetching token data: ${error.message}`);
    return {
      notFound: true,
    };
  }
};

const TokenDetailPage = ({ token }) => {
  return (
    <div>
      <h1>{token.name}</h1>
      <img src={token.logoURI} alt={token.name} />
      <p>Address: {token.address}</p>
      <p>Chain ID: {token.chainId}</p>
      {/* Add more token details as required */}
    </div>
  );
};

export default TokenDetailPage;

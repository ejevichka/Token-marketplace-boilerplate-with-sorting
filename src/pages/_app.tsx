import { type AppType } from "next/app";
import { Chakra_Petch } from "next/font/google";
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from "./layout";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Chakra_Petch({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-sans",
});

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <main className={`font-sans ${inter.variable}`}>
        <Layout>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </Layout>
      </main>
  );
};

export default api.withTRPC(MyApp);

import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-right" />
      <Head>
        <title>Chirp</title>
        <meta name="description" content="chirp home page." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/variable.css";

import theme from "../theme/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as gtag from "../lib/gtag";
import NProgress from "nprogress";
import NextHead from "next/head";

import "../styles/nprogress.css";
import Header from "../components/Header";
import "@fontsource/inter/500.css";
import ResponseHandler from "../components/ResponseHandler";
import WalletContext from "../contexts/WalletContext";

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV == "production";
const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) {
        (window as any).gtag("config", gtag.GA_TRACKING_ID, {
          page_path: url,
        });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  Router.events.on("routeChangeStart", (_) => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <WalletContext>
            <NextHead>
              <title>
                Liquid stake ETHEREUM tokens from ETHEREUM wallet. Get
                metaETHEREUM - Meta Pool
              </title>
              <meta
                name="description"
                content="Liquid Stake ETHEREUM tokens held in your ETHEREUM wallet. Earn ~10% staking rewards. Unstake immediately your metaETHEREUM tokens with Meta Pool metaETHEREUM-ETHEREUM liquidity pool "
              />
              <link rel="icon" href="/favicon.ico" />
              <meta charSet="UTF-8" />
            </NextHead>
            <Header />
            <Component {...pageProps} />
            <ResponseHandler />

            {/* enable analytics script only for production */}
            {/*isProduction && (
                <>
                <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
                strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', '${gtag.GA_TRACKING_ID}');
                `}
                </Script>
                </>
          )*/}
          </WalletContext>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    )
  );
}

export default App;

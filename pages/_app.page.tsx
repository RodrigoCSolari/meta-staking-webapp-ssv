import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/variable.css";

import theme from "../theme/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import NProgress from "nprogress";
import NextHead from "next/head";
import "@near-wallet-selector/modal-ui/styles.css";

import "../styles/nprogress.css";
import Header from "../components/Header";
import "@fontsource/inter/500.css";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import ErrorHandlerHash from "../components/ErrorHandlerHash";
import ResponseHandler from "../components/ResponseHandler";

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

  return (
    <ChakraProvider theme={theme}>
      <WalletSelectorContextProvider>
        <QueryClientProvider client={queryClient}>
          <NextHead>
            <title>
              Liquid stake NEAR tokens from NEAR wallet. Get stNEAR - Meta Pool
            </title>
            <meta
              name="description"
              content="Liquid Stake NEAR tokens held in your NEAR wallet. Earn ~10% staking rewards. Unstake immediately your stNEAR tokens with Meta Pool stNEAR-NEAR liquidity pool "
            />
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="UTF-8" />
          </NextHead>
          <Header />
          <Component {...pageProps} />
          <ResponseHandler />
          <ErrorHandlerHash />

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

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WalletSelectorContextProvider>
    </ChakraProvider>
  );
}

export default App;

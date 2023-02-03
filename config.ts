import { localhost } from "@wagmi/chains";
import { goerli, mainnet } from "wagmi";
import CONTRACT_JSON from "./DepAndWith.json";

export const getConfig = () => {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  switch (env) {
    case "production":
    case "mainnet":
      return {
        networkId: "mainnet",
        wagmiNetwork: mainnet,
        rcpUrl: "https://mainnet.infura.io/v3/",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET,
        explorerUrl: "https://etherscan.io",
        metapoolUrl: "https://metapool.app/dapp/mainnet/meta",
        uniswap: "https://uniswap.org/",
        abi: CONTRACT_JSON.abi,
      };
    case "development":
    case "goerli":
    case "preview":
      return {
        networkId: "goerli",
        wagmiNetwork: goerli,
        nodeUrl: "https://goerli.infura.io/v3/",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI,
        explorerUrl: "https://goerli.etherscan.io",
        metapoolUrl: "https://metapool.app/dapp/mainnet/meta",
        uniswap: "https://uniswap.org/",
        abi: CONTRACT_JSON.abi,
      };
    case "localhost":
      return {
        networkId: "localhost",
        wagmiNetwork: localhost,
        nodeUrl: "http://localhost:8545",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LOCALHOST,
        explorerUrl: "",
        metapoolUrl: "https://metapool.app/dapp/mainnet/meta",
        uniswap: "https://uniswap.org/",
        abi: CONTRACT_JSON.abi,
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
};

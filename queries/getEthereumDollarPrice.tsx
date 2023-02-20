import { EthereumDollarPrice } from "./getEthereumDollarPrice.types";

export const getEthereumDollarPrice = async (): Promise<number> => {
  let result = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  let response: EthereumDollarPrice = await result.json();
  return response.ethereum.usd;
};

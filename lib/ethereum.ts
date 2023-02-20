import { BigNumber, Contract, ethers, providers, Signer } from "ethers";
import { getConfig } from "../config";

const config = getConfig();

export const callChangeMethod = (
  method: string,
  args: any,
  signer: Signer,
  value: BigNumber = BigNumber.from("0")
) => {
  const writeContract = new Contract(
    config.contractAddress!,
    config.abi,
    signer
  );

  let resp = writeContract[method](...args, {
    value,
  });

  return resp;
};

export const callViewMethod = (
  method: string,
  args: any[],
  provider: providers.Provider
) => {
  let readContract = new ethers.Contract(
    config.contractAddress!,
    config.abi,
    provider
  );

  let resp = readContract[method](...args);
  return resp;
};

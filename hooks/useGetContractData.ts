import { ethers } from "ethers";
import { useQuery } from "react-query";
import { useAccount, useProvider } from "wagmi";
import { REFETCH_INTERVAL } from "../constants";
import { getContractData } from "../lib/metapool";
import { ContractData } from "../lib/metapool.types";

export const useGetContractData = () => {
  const provider = useProvider();
  const { address } = useAccount();
  return useQuery<ContractData>(
    "contractData",
    () => getContractData(provider, address),
    {
      onError: (err) => {
        console.error(err);
      },
      refetchInterval: REFETCH_INTERVAL,
      staleTime: REFETCH_INTERVAL,
    }
  );
};

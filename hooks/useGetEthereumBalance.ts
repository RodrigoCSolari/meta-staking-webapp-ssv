import { BigNumber } from "ethers";
import { useQuery } from "react-query";
import { useAccount, useProvider, useSigner } from "wagmi";
import { REFETCH_INTERVAL } from "../constants";

export const useGetEthereumBalance = () => {
  const { address } = useAccount();
  const provider = useProvider();

  return useQuery<BigNumber | undefined>(
    "ethereumBalance",
    () =>
      provider.getBalance(
        address || "0x0000000000000000000000000000000000000000"
      ),
    {
      onError: (err) => {
        console.error(err);
      },
      refetchInterval: REFETCH_INTERVAL,
      staleTime: REFETCH_INTERVAL,
    }
  );
};

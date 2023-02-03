import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getEthereumDollarPrice } from "../queries/getEthereumDollarPrice";

export const useGetEthereumDollarPrice = () => {
  return useQuery("ethereumDollarPrice", () => getEthereumDollarPrice(), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

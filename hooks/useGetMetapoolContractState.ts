import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getMetapoolContractState } from "../lib/metapool";

export const useGetMetapoolContractState = () => {
  return useQuery("metapoolContractState", () => getMetapoolContractState(), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

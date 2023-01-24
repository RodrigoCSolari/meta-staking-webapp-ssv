import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getMetapoolAccountInfo } from "../lib/metapool";

export const useGetMetapoolAccountInfo = (accountId: string) => {
  return useQuery(
    "metapoolAccountInfo",
    () => getMetapoolAccountInfo(accountId),
    {
      onError: (err) => {
        console.error(err);
      },
      refetchInterval: REFETCH_INTERVAL,
      staleTime: REFETCH_INTERVAL,
    }
  );
};

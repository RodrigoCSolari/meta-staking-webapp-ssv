import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getNearBalance } from "../lib/near";

export const useGetNearBalance = (accountId: string) => {
  return useQuery<string>("nearBalance", () => getNearBalance(accountId), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getNearDollarPrice } from "../queries/getNearDollarPrice";

export const useGetNearDollarPrice = () => {
  return useQuery("nearDollarPrice", () => getNearDollarPrice(), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

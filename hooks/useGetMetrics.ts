import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getMetrics } from "../queries/getMetrics";
import { Metrics } from "../queries/getMetrics.types";

export const useGetMetrics = () => {
  return useQuery<Metrics>("metrics", () => getMetrics(), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

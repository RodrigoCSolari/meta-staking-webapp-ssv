import { useQuery } from "react-query";
import { REFETCH_INTERVAL } from "../constants";
import { getEpochInfo } from "../queries/getEpochInfo";

export const useGetEpochInfo = () => {
  return useQuery("EpochInfo", () => getEpochInfo(), {
    onError: (err) => {
      console.error(err);
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });
};

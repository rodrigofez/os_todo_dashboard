import { useQuery } from "@tanstack/react-query";
import { API_ROUTES, OverviewMetrics } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useOverviewMetrics() {
  const { http } = useApi();

  return useQuery({
    queryKey: QUERY_KEYS.OVERVIEW_METRICS,
    queryFn: async () => http.get<OverviewMetrics>(API_ROUTES.OVERVIEW)
  });
}



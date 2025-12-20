import { useQuery } from "@tanstack/react-query";
import { API_ROUTES, OverviewMetrics } from "../../common";
import { useApi } from "../context/ApiContext";

export function useOverviewMetrics() {
  const { http } = useApi();

  return useQuery({
    queryKey: ['overview-metrics'],
    queryFn: async () => http.get<OverviewMetrics>(API_ROUTES.OVERVIEW)
  });
}



import { useQuery } from "@tanstack/react-query";
import { API_BASE_PATH, DetailedMetrics } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useMetrics() {
    const { http } = useApi();

    return useQuery({
        queryKey: QUERY_KEYS.METRICS,
        queryFn: async () => http.get<DetailedMetrics>(
            `${API_BASE_PATH}/metrics`
        )
    });
}



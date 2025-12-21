import { useQuery } from "@tanstack/react-query";
import { API_BASE_PATH, DetailedMetrics } from "../../common";
import { useApi } from "../context/ApiContext";
import { TodoQueryParams } from "../services/api/TodoApiClient";

export function useMetrics(params?: TodoQueryParams) {
    const { http } = useApi();

    return useQuery({
        queryKey: ['todos', 'metrics', JSON.stringify(params)],
        queryFn: async () => http.get<DetailedMetrics>(
            `${API_BASE_PATH}/metrics`
        )
    });
}



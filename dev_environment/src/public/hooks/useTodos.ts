import { useQuery } from "@tanstack/react-query";
import { API_ROUTES, PaginatedResponse, Todo } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useTodos(params?: {
  q?: string,
  status?: string,
  priority?: string,
  pageSize: number,
  page: number,
  sortBy: string,
  sortOrder: string,
}) {
  const { http } = useApi();

  return useQuery({
    queryKey: QUERY_KEYS.TODOS_WITH_PARAMS(JSON.stringify(params)),
    queryFn: async () => http.get<PaginatedResponse<Todo>>(
      API_ROUTES.TODOS,
      { query: params as any }
    )
  });
}



import { useQuery } from "@tanstack/react-query";
import { API_ROUTES, PaginatedResponse, Todo } from "../../common";
import { useApi } from "../context/ApiContext";
import { TodoQueryParams } from "../services/api/TodoApiClient";

export function useTodos(params?: TodoQueryParams) {
  const { http } = useApi();

  return useQuery({
    queryKey: ['todos', JSON.stringify(params)],
    queryFn: async () => http.get<PaginatedResponse<Todo>>(
      API_ROUTES.TODOS,
      { query: params as any }
    )
  });
}



import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_PATH, CreateTodoRequest, Todo } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useCreateTodo({ onSuccess }: { onSuccess: () => void }) {
  const { http } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTodoRequest) =>
      http.post<Todo>(`${API_BASE_PATH}/todos`, {
        body: JSON.stringify(data),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
    },
    onSuccess,
  });
}

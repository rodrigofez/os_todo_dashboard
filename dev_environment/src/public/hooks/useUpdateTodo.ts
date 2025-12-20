import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_PATH, PaginatedResponse, Todo, UpdateTodoRequest } from "../../common";
import { useApi } from "../context/ApiContext";

export function useUpdateTodo() {
  const { http } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: ({ id, data }) => {
      // optimistically update task
      queryClient.setQueryData(['todos'], (oldData: PaginatedResponse<Todo> | undefined) => {
        if (oldData) return {
          data: oldData.data.map((todo) => todo.id === id ? { ...todo, ...data } : todo),
          pagination: oldData.pagination
        }

        return oldData;
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    mutationFn: async ({ id, data }: { id: string, data: UpdateTodoRequest }) => http.put<Todo>(`${API_BASE_PATH}/todos/${id}`, {
      body: JSON.stringify(data),
    })
  })
}


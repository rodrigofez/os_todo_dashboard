import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_PATH, PaginatedResponse, Todo } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useBulkDeleteTodo() {
    const { http } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        onMutate: (id: string) => {
            // Optimistically delete task
            queryClient.setQueryData(QUERY_KEYS.TODOS, (oldData: PaginatedResponse<Todo> | undefined) => {
                if (oldData) return {
                    data: oldData.data.filter((todo) => todo.id !== id),
                    pagination: {
                        ...oldData.pagination,
                        total: oldData.pagination.total - 1
                    }
                }
                return oldData;
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS })
        },
        mutationFn: async (id: string) => http.delete<PaginatedResponse<Todo>>(
            `${API_BASE_PATH}/todos/${id}`
        )
    });
}

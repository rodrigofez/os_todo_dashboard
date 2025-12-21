import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "../../common";
import { useApi } from "../context/ApiContext";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useSeed() {
  const { http } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: number = 200) =>
      http.post<{ created: number }>(API_ROUTES.SEED, {
        body: JSON.stringify({ count }),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODOS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.METRICS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OVERVIEW_METRICS });
    },
  });
}

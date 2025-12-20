import { Criteria } from "@elastic/eui";
import { useMemo, useState } from "react";
import { Todo, TodoPriority, TodoStatus } from "../../common";
import { useDebounce } from "./useDebounce";
import { useDeleteTodo } from "./useDeleteTodo";
import { useTodos } from "./useTodos";

export const useTodoTable = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [sortField, setSortField] = useState<keyof Todo>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [selectedItems, setSelectedItems] = useState<Todo[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [selectedStatuses, setSelectedStatuses] = useState<TodoStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TodoPriority[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const queryParams = useMemo(
    () => ({
      q: debouncedSearchQuery || undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses.join(",") : undefined,
      priority: selectedPriorities.length > 0 ? selectedPriorities.join(",") : undefined,
      pageSize,
      page: pageIndex + 1,
      sortBy: sortField,
      sortOrder: sortDirection,
    }),
    [debouncedSearchQuery, selectedStatuses, selectedPriorities, pageSize, pageIndex, sortField, sortDirection]
  );

  const { data: todos, isLoading, isError, refetch } = useTodos(queryParams);
  const { mutateAsync: deleteTodo, isPending: deleteLoading } = useDeleteTodo();

  const handleTableChange = (criteria: Criteria<Todo>) => {
    if (criteria.page) {
      setPageIndex(criteria.page.index);
      setPageSize(criteria.page.size);
    }
    if (criteria.sort) {
      setSortField(criteria.sort.field);
      setSortDirection(criteria.sort.direction);
    }
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedItems.map((item) => deleteTodo(item.id)));
    setSelectedItems([]);
    refetch();
  };

  const handleStatusChange = (statuses: TodoStatus[]) => {
    setSelectedStatuses(statuses);
    setPageIndex(0); // reset to first page when filters change
  };

  const handlePriorityChange = (priorities: TodoPriority[]) => {
    setSelectedPriorities(priorities);
    setPageIndex(0); // reset to first page when filters change
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return {
    todos,
    isLoading,
    isError,
    refetch,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    selectedItems,
    setSelectedItems,
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    selectedPriorities,
    handleStatusChange,
    handlePriorityChange,
    isModalVisible,
    openModal,
    closeModal,
    handleTableChange,
    handleDeleteSelected,
    deleteLoading,
  };
};

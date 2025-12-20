import { CriteriaWithPagination } from "@elastic/eui";
import { Todo } from "../../../common";

export interface TodoTableProps {
    todos: Todo[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    sortField: keyof Todo;
    sortDirection: "asc" | "desc";
    onTableChange: (criteria: CriteriaWithPagination<Todo>) => void;
    onSelectionChange: (items: Todo[]) => void;
    refetch: () => void;
}

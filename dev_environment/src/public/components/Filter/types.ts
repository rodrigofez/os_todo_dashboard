import { TodoPriority, TodoStatus } from "../../../common";

export interface FilterItem<T> {
    name: string;
    value: T;
}

export interface FiltersProps {
    selectedStatuses: TodoStatus[];
    selectedPriorities: TodoPriority[];
    onStatusChange: (statuses: TodoStatus[]) => void;
    onPriorityChange: (priorities: TodoPriority[]) => void;
}

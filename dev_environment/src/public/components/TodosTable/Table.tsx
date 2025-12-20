import {
    EuiBasicTable,
    EuiBasicTableColumn
} from "@elastic/eui";
import React, { useMemo } from "react";
import { Todo, TodoPriority, TodoStatus } from "../../../common";
import { useDeleteTodo } from "../../hooks/useDeleteTodo";
import { TodoPriorityBadge } from "./PriorityBadge";
import { TodoStatusSelect } from "./StatusSelect";
import { TodoTableProps } from "./types";


export const TodoTable: React.FC<TodoTableProps> = ({
    todos,
    totalCount,
    pageIndex,
    pageSize,
    sortField,
    sortDirection,
    onTableChange,
    onSelectionChange,
    refetch,
}) => {
    const { mutateAsync: deleteTodo } = useDeleteTodo();

    const handleDelete = async (todo: Todo) => {
        await deleteTodo(todo.id);
        refetch();
    };

    const columns: Array<EuiBasicTableColumn<Todo>> = useMemo(
        () => [
            { field: "title", name: "Title", truncateText: true },
            {
                field: "status",
                name: "Status",
                sortable: true,
                render: (status: TodoStatus, item: Todo) => (
                    <TodoStatusSelect id={item.id} status={status} />
                ),
            },
            {
                field: "priority",
                name: "Priority",
                sortable: true,
                render: (priority: TodoPriority) => <TodoPriorityBadge priority={priority} />,
            },
            {
                field: "description",
                name: "Description",
                truncateText: true,
            },
            {
                field: "created_at",
                name: "Created",
                dataType: "date",
                render: (date: string) => new Date(date).toLocaleDateString(),
                sortable: true,
            },
            {
                name: "Actions",
                actions: [
                    {
                        name: "Delete",
                        description: "Delete this task",
                        icon: "trash",
                        color: "danger",
                        type: "icon",
                        onClick: handleDelete,
                    },
                ],
            },
        ],
        [refetch]
    );

    return (
        <EuiBasicTable
            data-test-subj="todo-table"
            items={todos}
            itemId="id"
            columns={columns}
            pagination={{
                pageIndex,
                pageSize,
                totalItemCount: totalCount,
                pageSizeOptions: [10, 20, 50, 100],
            }}
            sorting={{ sort: { field: sortField, direction: sortDirection } }}
            selection={{
                selectable: (todo) => true,
                selectableMessage: (selectable) =>
                    !selectable ? "Task is archived" : "",
                onSelectionChange,
            }}
            onChange={onTableChange}
        />
    );
};

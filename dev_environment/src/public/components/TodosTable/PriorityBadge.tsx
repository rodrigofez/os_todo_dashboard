import { EuiBadge } from "@elastic/eui";
import React from "react";
import { TodoPriority } from "../../../common";

interface Props {
    priority: TodoPriority;
}

export const TodoPriorityBadge: React.FC<Props> = ({ priority }) => {
    const colorMap: Record<TodoPriority, string> = {
        [TodoPriority.CRITICAL]: "danger",
        [TodoPriority.HIGH]: "warning",
        [TodoPriority.MEDIUM]: "default",
        [TodoPriority.LOW]: "success",
    };

    const labelMap: Record<TodoPriority, string> = {
        [TodoPriority.CRITICAL]: "Critical",
        [TodoPriority.HIGH]: "High",
        [TodoPriority.MEDIUM]: "Medium",
        [TodoPriority.LOW]: "Low",
    };

    return <EuiBadge color={colorMap[priority]}>{labelMap[priority]}</EuiBadge>;
};

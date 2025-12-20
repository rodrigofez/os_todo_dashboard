import { EuiHealth, EuiSuperSelect } from "@elastic/eui";
import React from "react";
import { TodoStatus } from "../../../common";
import { useUpdateTodo } from "../../hooks/useUpdateTodo";

interface Props {
    id: string;
    status: TodoStatus;
}

const options = [
    { value: TodoStatus.PLANNED, color: "subdued", label: "Planned" },
    { value: TodoStatus.IN_PROGRESS, color: "warning", label: "In progress" },
    { value: TodoStatus.ERROR, color: "danger", label: "Error" },
    { value: TodoStatus.COMPLETED, color: "success", label: "Completed" },
];

export const TodoStatusSelect: React.FC<Props> = ({ id, status }) => {
    const { mutateAsync: updateTodo } = useUpdateTodo();

    return (
        <EuiSuperSelect
            fullWidth
            options={options.map((opt) => ({
                value: opt.value,
                inputDisplay: (
                    <EuiHealth color={opt.color} style={{ lineHeight: "inherit" }}>
                        {opt.label}
                    </EuiHealth>
                ),
            }))}
            valueOfSelected={status}
            onChange={(value) => updateTodo({ id, data: { status: value } })}
        />
    );
};

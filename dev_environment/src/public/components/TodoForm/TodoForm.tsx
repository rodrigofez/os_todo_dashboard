import {
    EuiCallOut,
    EuiComboBox,
    EuiDatePicker,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiSuperSelect,
    EuiTextArea,
} from "@elastic/eui";
import React from "react";
import { Controller } from "react-hook-form";
import { TodoPriority } from "../../../common";
import { useTodoForm } from "../../hooks/useTodoForm";


export const tagOptions = [
    { label: "PCI DSS" },
    { label: "ISO 27001" },
    { label: "SOX" },
];

export const priorityOptions = [
    { value: TodoPriority.LOW, label: "Low" },
    { value: TodoPriority.MEDIUM, label: "Medium" },
    { value: TodoPriority.HIGH, label: "High" },
    { value: TodoPriority.CRITICAL, label: "Critical" },
];


interface Props {
    formId: string;
    onSuccess: () => void;
}

export const TodoForm: React.FC<Props> = ({
    formId,
    onSuccess
}) => {

    const {
        control,
        onSubmit,
        loading,
        error,
        formState: { errors },
    } = useTodoForm(onSuccess);

    return <EuiForm role="form" id={formId} component="form" onSubmit={onSubmit}>
        {error && (
            <EuiFormRow>
                <EuiCallOut title="Error creating task" color="danger" iconType="alert">
                    <p>{"There was an error trying to create a new task"}</p>
                </EuiCallOut>
            </EuiFormRow>
        )}
        <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field: { ref, ...rest } }) => (
                <EuiFormRow
                    label="Title"
                    isInvalid={!!errors.title}
                    error={errors.title?.message}
                >
                    <EuiFieldText {...rest} inputRef={ref} isInvalid={!!errors.title} disabled={loading} />
                </EuiFormRow>
            )}
        />
        <Controller
            name="description"
            control={control}
            render={({ field: { ref, ...rest } }) => (
                <EuiFormRow label="Description">
                    <EuiTextArea {...rest} inputRef={ref} disabled={loading} />
                </EuiFormRow>
            )}
        />
        <Controller
            name="priority"
            control={control}
            render={({ field }) => (
                <EuiFormRow label="Priority">
                    <EuiSuperSelect
                        aria-label="Priority"
                        options={priorityOptions.map((opt) => ({
                            value: opt.value,
                            inputDisplay: opt.label,
                        }))}
                        valueOfSelected={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                    />
                </EuiFormRow>
            )}
        />
        <Controller
            name="assignee"
            control={control}
            rules={{ required: "Assignee is required" }}
            render={({ field: { ref, ...rest } }) => (
                <EuiFormRow
                    label="Assignee"
                    isInvalid={!!errors.assignee}
                    error={errors.assignee?.message}
                >
                    <EuiFieldText {...rest} inputRef={ref} isInvalid={!!errors.assignee} disabled={loading} />
                </EuiFormRow>
            )}
        />
        <Controller
            name="dueDate"
            control={control}
            rules={{ required: "Due date is required" }}
            render={({ field }) => (
                <EuiFormRow
                    label="Due date"
                    isInvalid={!!errors.dueDate}
                    error={errors.dueDate?.message}
                >
                    <EuiDatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        disabled={loading}
                        isInvalid={!!errors.dueDate}
                        placeholder="Select a date"
                    />
                </EuiFormRow>
            )}
        />
        <Controller
            name="tags"
            control={control}
            render={({ field }) => (
                <EuiFormRow label="Tags">
                    <EuiComboBox
                        placeholder="Select or create tags"
                        options={tagOptions}
                        selectedOptions={field.value}
                        onChange={field.onChange}
                        inputRef={field.ref}
                        onCreateOption={(searchValue) => {
                            const trimmed = searchValue.trim();
                            if (!trimmed) return;
                            field.onChange([...field.value, { label: trimmed }]);
                        }}
                        isDisabled={loading}
                    />
                </EuiFormRow>
            )}
        />
    </EuiForm>
};

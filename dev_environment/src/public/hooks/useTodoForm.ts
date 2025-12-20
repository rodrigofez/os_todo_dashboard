import { SubmitHandler, useForm } from "react-hook-form";
import { TodoPriority } from "../../common";
import { useCreateTodo } from "./useCreateTodo";
import { TodoFormData } from "../components/TodoForm/types";

export const useTodoForm = (onSuccess: () => void) => {
  const { mutate: createTodo, isPending: loading, error } = useCreateTodo({ onSuccess });

  const formMethods = useForm<TodoFormData>({
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      priority: TodoPriority.MEDIUM,
      dueDate: null,
      tags: [],
    },
  });

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    createTodo({
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      priority: data.priority,
      assignee: data.assignee.trim() || undefined,
      tags: data.tags.map((t) => t.label),
      due_date: data.dueDate?.toISOString(),
    });
  };

  return {
    ...formMethods,
    onSubmit: formMethods.handleSubmit(onSubmit),
    loading,
    error,
  };
};

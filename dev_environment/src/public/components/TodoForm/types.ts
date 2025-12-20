import { Moment } from "moment";
import { TodoPriority } from "../../../common";

export interface TodoFormData {
    title: string;
    description: string;
    assignee: string;
    priority: TodoPriority;
    dueDate: Moment | null;
    tags: { label: string }[];
}

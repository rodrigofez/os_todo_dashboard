import {
    EuiButton,
    EuiButtonEmpty,
    EuiLoadingSpinner,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
} from "@elastic/eui";
import React from "react";
import { TodoForm } from "./TodoForm";

interface Props {
    title: string;
    isVisible: boolean;
    onClose: () => void;
    loading?: boolean;
}

const TODO_FORM_ID = 'todo_form'

export const TodoModal: React.FC<Props> = ({
    title,
    isVisible,
    onClose,
    loading,
}) => {
    if (!isVisible) return null;

    return (
        <EuiModal onClose={onClose} initialFocus="[name=title]">
            <EuiModalHeader>
                <EuiModalHeaderTitle>
                    <h1>{title}</h1>
                </EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody><TodoForm formId={TODO_FORM_ID} onSuccess={onClose} /></EuiModalBody>
            <EuiModalFooter>
                <EuiButtonEmpty onClick={onClose} disabled={loading}>
                    Cancel
                </EuiButtonEmpty>
                <EuiButton type="submit" form={TODO_FORM_ID} fill disabled={loading}>
                    {loading ? <EuiLoadingSpinner size="m" /> : "Save"}
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};

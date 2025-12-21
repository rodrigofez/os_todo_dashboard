import {
    EuiButton,
    EuiCallOut,
    EuiFieldSearch,
    EuiFlexGroup,
    EuiFlexItem,
    EuiHorizontalRule,
    EuiLoadingSpinner,
    EuiSpacer,
    EuiTitle,
} from "@elastic/eui";
import React from "react";
import { useTodoTable } from "../../hooks/useTodoTable";
import { useSeed } from "../../hooks/useSeed";
import { TodoTable } from "./Table";
import { TodoModal } from "../TodoForm/TodoModal";
import { Filters } from "../Filter/Filter";


export const Table: React.FC = () => {
    const {
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
    } = useTodoTable();

    const { mutate: seedData, isPending: isSeedLoading } = useSeed();

    if (isError) {
        return (
            <EuiCallOut title="Error loading tasks" color="danger" iconType="alert">
                <EuiButton onClick={() => refetch()}>Retry</EuiButton>
            </EuiCallOut>
        );
    }

    return (
        <>
            <TodoModal
                title="Add new task"
                isVisible={isModalVisible}
                onClose={closeModal}
            />
            <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
                <EuiFlexItem>
                    <EuiTitle>
                        <h1>Tasks ({todos?.pagination.total ?? 0})</h1>
                    </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="s">
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                onClick={() => seedData(200)}
                                isLoading={isSeedLoading}
                            >
                                Seed Data (200)
                            </EuiButton>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButton fill onClick={openModal}>
                                Add new task +
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule />
            <EuiFlexGroup alignItems="center" gutterSize="m">
                <EuiFlexItem>
                    <EuiFieldSearch
                        fullWidth
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        isClearable
                        aria-label="Search tasks"
                    />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <Filters
                        selectedStatuses={selectedStatuses}
                        selectedPriorities={selectedPriorities}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                    />
                </EuiFlexItem>
                {selectedItems.length > 0 && (
                    <EuiFlexItem grow={false}>
                        <EuiButton
                            color="danger"
                            iconType="trash"
                            onClick={handleDeleteSelected}
                            isLoading={deleteLoading}
                        >
                            Delete {selectedItems.length} Task
                            {selectedItems.length > 1 ? "s" : ""}
                        </EuiButton>
                    </EuiFlexItem>
                )}
            </EuiFlexGroup>
            <EuiSpacer size="l" />
            {isLoading ? (
                <EuiFlexGroup
                    justifyContent="center"
                    alignItems="center"
                    style={{ minHeight: "200px" }}
                >
                    <EuiLoadingSpinner data-test-subj="spinner" size="xl" />
                </EuiFlexGroup>
            ) : (
                <TodoTable
                    todos={todos?.data ?? []}
                    totalCount={todos?.pagination.total ?? 0}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onTableChange={handleTableChange}
                    onSelectionChange={setSelectedItems}
                    refetch={refetch}
                />
            )}
        </>
    );
};

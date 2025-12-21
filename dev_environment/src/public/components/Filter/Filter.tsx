import {
    EuiFilterButton,
    EuiFilterGroup,
    EuiFilterSelectItem,
    EuiPopover,
} from "@elastic/eui";
import React, { useState } from 'react';
import { TodoPriority, TodoStatus } from '../../../common';
import { FilterItem, FiltersProps } from "./types";

const STATUS_OPTIONS: FilterItem<TodoStatus>[] = [
    { name: 'Planned', value: TodoStatus.PLANNED },
    { name: 'In Progress', value: TodoStatus.IN_PROGRESS },
    { name: 'Error', value: TodoStatus.ERROR },
    { name: 'Completed', value: TodoStatus.COMPLETED },
];

const PRIORITY_OPTIONS: FilterItem<TodoPriority>[] = [
    { name: 'Low', value: TodoPriority.LOW },
    { name: 'Medium', value: TodoPriority.MEDIUM },
    { name: 'High', value: TodoPriority.HIGH },
    { name: 'Critical', value: TodoPriority.CRITICAL },
];

/**
 * Filters component for filtering tasks by status and priority
 */
export const Filters: React.FC<FiltersProps> = ({
    selectedStatuses,
    selectedPriorities,
    onStatusChange,
    onPriorityChange,
}) => {
    const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
    const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = useState(false);

    const toggleStatus = (status: TodoStatus) => {
        const isSelected = selectedStatuses.includes(status);
        const newStatuses = isSelected
            ? selectedStatuses.filter(s => s !== status)
            : [...selectedStatuses, status];
        onStatusChange(newStatuses);
    };

    const togglePriority = (priority: TodoPriority) => {
        const isSelected = selectedPriorities.includes(priority);
        const newPriorities = isSelected
            ? selectedPriorities.filter(p => p !== priority)
            : [...selectedPriorities, priority];
        onPriorityChange(newPriorities);
    };

    const hasActiveStatusFilters = selectedStatuses.length > 0 && selectedStatuses.length < STATUS_OPTIONS.length;
    const hasActivePriorityFilters = selectedPriorities.length > 0 && selectedPriorities.length < PRIORITY_OPTIONS.length;

    const statusButton = (
        <EuiFilterButton
            iconType="arrowDown"
            onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
            isSelected={isStatusPopoverOpen}
            numFilters={STATUS_OPTIONS.length}
            hasActiveFilters={hasActiveStatusFilters}
            numActiveFilters={selectedStatuses.length}
        >
            Status
        </EuiFilterButton>
    );

    const priorityButton = (
        <EuiFilterButton
            iconType="arrowDown"
            onClick={() => setIsPriorityPopoverOpen(!isPriorityPopoverOpen)}
            isSelected={isPriorityPopoverOpen}
            numFilters={PRIORITY_OPTIONS.length}
            hasActiveFilters={hasActivePriorityFilters}
            numActiveFilters={selectedPriorities.length}
        >
            Priority
        </EuiFilterButton>
    );

    return (
        <EuiFilterGroup>
            <EuiPopover
                id="statusFilterPopover"
                button={statusButton}
                isOpen={isStatusPopoverOpen}
                closePopover={() => setIsStatusPopoverOpen(false)}
                panelPaddingSize="none"
            >
                <div className="euiFilterSelect__items">
                    {STATUS_OPTIONS.map((item) => (
                        <EuiFilterSelectItem
                            key={item.value}
                            checked={selectedStatuses.includes(item.value) ? 'on' : undefined}
                            onClick={() => toggleStatus(item.value)}
                        >
                            {item.name}
                        </EuiFilterSelectItem>
                    ))}
                </div>
            </EuiPopover>

            <EuiPopover
                id="priorityFilterPopover"
                button={priorityButton}
                isOpen={isPriorityPopoverOpen}
                closePopover={() => setIsPriorityPopoverOpen(false)}
                panelPaddingSize="none"
            >
                <div className="euiFilterSelect__items">
                    {PRIORITY_OPTIONS.map((item) => (
                        <EuiFilterSelectItem
                            key={item.value}
                            checked={selectedPriorities.includes(item.value) ? 'on' : undefined}
                            onClick={() => togglePriority(item.value)}
                        >
                            {item.name}
                        </EuiFilterSelectItem>
                    ))}
                </div>
            </EuiPopover>
        </EuiFilterGroup>
    );
};

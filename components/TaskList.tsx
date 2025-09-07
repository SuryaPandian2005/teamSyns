import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Task, TaskStatus, User, TaskPriority } from '../types';
import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';

interface TaskListProps {
    tasks: Task[];
    users: User[];
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
}

// Custom hook for detecting clicks outside a ref'd element
const useClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

interface FilterDropdownProps<T> {
    label: string;
    options: readonly T[];
    selected: T[];
    onChange: (value: T) => void;
    renderOption: (option: T) => React.ReactNode;
}

const FilterDropdown = <T extends string>({ label, options, selected, onChange, renderOption }: FilterDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));
    
    const isActive = selected.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                    isActive 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                <span>{label}</span>
                {isActive && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">{selected.length}</span>
                )}
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border max-h-72 overflow-y-auto">
                    <ul className="p-2 space-y-1">
                        {options.map(option => (
                            <li key={option}>
                                <label className="flex items-center w-full px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selected.includes(option)}
                                        onChange={() => onChange(option)}
                                    />
                                    <span className="ml-3 text-sm text-gray-800">{renderOption(option)}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, users, onUpdateTask, onDeleteTask }) => {
    const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done]);
    const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, selectedItems: T[], item: T) => {
        setter(selectedItems.includes(item) ? selectedItems.filter(i => i !== item) : [...selectedItems, item]);
    };
    
    const clearFilters = () => {
        setSelectedPriorities([]);
        setSelectedAssignees([]);
    };
    
    const isAnyFilterActive = selectedPriorities.length > 0 || selectedAssignees.length > 0;

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);
            const assigneeMatch = selectedAssignees.length === 0 || selectedAssignees.includes(task.assigneeId);
            return priorityMatch && assigneeMatch;
        });
    }, [tasks, selectedPriorities, selectedAssignees]);
    
    const priorityOptions = useMemo(() => Object.values(TaskPriority), []);
    const statusOptions = useMemo(() => Object.values(TaskStatus), []);
    const assigneeOptions = useMemo(() => users.map(u => u.id), [users]);

    const handleUpdate = (updatedTask: Task) => {
        onUpdateTask(updatedTask);
        setEditingTask(null);
    };
    
    const handleDelete = (taskId: string) => {
        onDeleteTask(taskId);
        setEditingTask(null);
    };

    const allColumns: { title: TaskStatus; tasks: Task[] }[] = [
        {
            title: TaskStatus.ToDo,
            tasks: filteredTasks.filter(task => task.status === TaskStatus.ToDo),
        },
        {
            title: TaskStatus.InProgress,
            tasks: filteredTasks.filter(task => task.status === TaskStatus.InProgress),
        },
        {
            title: TaskStatus.Done,
            tasks: filteredTasks.filter(task => task.status === TaskStatus.Done),
        },
    ];

    const visibleColumns = allColumns.filter(col => selectedStatuses.includes(col.title));

    const getColumnTitleColor = (status: TaskStatus) => {
        switch(status) {
            case TaskStatus.ToDo: return 'border-t-secondary';
            case TaskStatus.InProgress: return 'border-t-accent-blue';
            case TaskStatus.Done: return 'border-t-accent-green';
            default: return 'border-t-gray-400';
        }
    };
    
    const gridColsClass = `md:grid-cols-${Math.min(visibleColumns.length, 3)}`;

    return (
        <div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white mb-6 flex items-center space-x-3">
                <FilterDropdown 
                    label="Status"
                    options={statusOptions}
                    selected={selectedStatuses}
                    onChange={(status) => handleFilterChange(setSelectedStatuses, selectedStatuses, status)}
                    renderOption={(status) => <span>{status}</span>}
                />
                <FilterDropdown 
                    label="Priority"
                    options={priorityOptions}
                    selected={selectedPriorities}
                    onChange={(priority) => handleFilterChange(setSelectedPriorities, selectedPriorities, priority)}
                    renderOption={(priority) => <span>{priority}</span>}
                />
                <FilterDropdown 
                    label="Assignee"
                    options={assigneeOptions}
                    selected={selectedAssignees}
                    onChange={(assigneeId) => handleFilterChange(setSelectedAssignees, selectedAssignees, assigneeId)}
                    renderOption={(assigneeId) => {
                        const user = users.find(u => u.id === assigneeId);
                        return (
                            <div className="flex items-center">
                                <img src={user?.avatarUrl} alt={user?.name} className="w-5 h-5 rounded-full mr-2"/>
                                <span>{user?.name}</span>
                            </div>
                        );
                    }}
                />
                {isAnyFilterActive && (
                    <button onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
                        Clear All
                    </button>
                )}
            </div>

            <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
                {visibleColumns.map(column => (
                    <div key={column.title} className="bg-slate-100/80 rounded-xl">
                        <div className={`px-4 py-3 border-t-4 ${getColumnTitleColor(column.title)} rounded-t-xl`}>
                            <h3 className="text-base font-semibold text-dark flex items-center">
                                {column.title}
                                <span className="ml-2 text-sm text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{column.tasks.length}</span>
                            </h3>
                        </div>
                        <div className="p-4 space-y-4 h-full overflow-y-auto" style={{maxHeight: '70vh'}}>
                            {column.tasks.length > 0 ? (
                                column.tasks.map(task => 
                                    <div key={task.id} onClick={() => setEditingTask(task)}>
                                        <TaskCard task={task} users={users} />
                                    </div>
                                )
                            ) : (
                                <div className="text-center text-sm text-gray-500 py-10 px-4">
                                    {filteredTasks.length === 0 && tasks.length > 0 
                                        ? "No tasks match the current filters."
                                        : "No tasks in this column."
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                 {visibleColumns.length === 0 && (
                    <div className="col-span-1 md:col-span-3 text-center text-gray-500 bg-white/80 p-12 rounded-xl">
                        Select a status to view columns.
                    </div>
                )}
            </div>

            {editingTask && (
                <EditTaskModal 
                    task={editingTask}
                    users={users}
                    onClose={() => setEditingTask(null)}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default TaskList;

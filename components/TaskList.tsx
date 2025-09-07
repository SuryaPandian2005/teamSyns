import React from 'react';
import { Task, TaskStatus, User } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
    tasks: Task[];
    users: User[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users }) => {
    const columns: { title: TaskStatus; tasks: Task[] }[] = [
        {
            title: TaskStatus.ToDo,
            tasks: tasks.filter(task => task.status === TaskStatus.ToDo),
        },
        {
            title: TaskStatus.InProgress,
            tasks: tasks.filter(task => task.status === TaskStatus.InProgress),
        },
        {
            title: TaskStatus.Done,
            tasks: tasks.filter(task => task.status === TaskStatus.Done),
        },
    ];

    const getColumnTitleColor = (status: TaskStatus) => {
        switch(status) {
            case TaskStatus.ToDo: return 'border-t-secondary';
            case TaskStatus.InProgress: return 'border-t-accent-blue';
            case TaskStatus.Done: return 'border-t-accent-green';
            default: return 'border-t-gray-400';
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => (
                <div key={column.title} className="bg-slate-100/80 rounded-xl">
                    <div className={`px-4 py-3 border-t-4 ${getColumnTitleColor(column.title)} rounded-t-xl`}>
                        <h3 className="text-base font-semibold text-dark flex items-center">
                            {column.title}
                            <span className="ml-2 text-sm text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{column.tasks.length}</span>
                        </h3>
                    </div>
                    <div className="p-4 space-y-4 h-full overflow-y-auto" style={{maxHeight: '70vh'}}>
                        {column.tasks.length > 0 ? (
                            column.tasks.map(task => <TaskCard key={task.id} task={task} users={users} />)
                        ) : (
                            <div className="text-center text-sm text-gray-500 py-10">No tasks here.</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
import React from 'react';
import { Task, TaskPriority, User } from '../types';

interface TaskCardProps {
    task: Task;
    users: User[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, users }) => {
    const assignee = users.find(user => user.id === task.assigneeId);

    const getPriorityStyles = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.High:
                return {
                    badge: 'bg-red-100 text-red-800',
                    border: 'border-l-accent-red'
                };
            case TaskPriority.Medium:
                return {
                    badge: 'bg-yellow-100 text-yellow-800',
                    border: 'border-l-accent-yellow'
                };
            case TaskPriority.Low:
                return {
                    badge: 'bg-green-100 text-green-800',
                    border: 'border-l-accent-green'
                };
            default:
                 return {
                    badge: 'bg-gray-100 text-gray-800',
                    border: 'border-l-secondary'
                };
        }
    };

    const priorityStyles = getPriorityStyles(task.priority);
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${priorityStyles.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 pr-2">
                    {task.isBlocked && (
                        <div title="This task is blocked">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                        </div>
                    )}
                    <h4 className="font-semibold text-dark text-base">{task.title}</h4>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityStyles.badge} flex-shrink-0`}>
                    {task.priority}
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{task.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <svg className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                {assignee && (
                    <img
                        className="w-8 h-8 rounded-full ring-2 ring-white"
                        src={assignee.avatarUrl}
                        alt={assignee.name}
                        title={assignee.name}
                    />
                )}
            </div>
        </div>
    );
};

export default TaskCard;
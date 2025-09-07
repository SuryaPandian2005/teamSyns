import React, { useMemo } from 'react';
import { Project, Task, User } from '../types';

interface ProjectTimelineProps {
    project: Project;
    tasks: Task[];
    users: User[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project, tasks, users }) => {
    const { startDate, endDate, duration, timelineMonths } = useMemo(() => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        
        const months = [];
        let current = new Date(startDate);
        current.setDate(1);

        while (current <= endDate) {
            months.push({
                name: current.toLocaleString('default', { month: 'short' }),
                year: current.getFullYear(),
                days: new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate(),
            });
            current.setMonth(current.getMonth() + 1);
        }

        return { startDate, endDate, duration, timelineMonths: months };
    }, [project.startDate, project.endDate]);

    const getTaskPosition = (task: Task) => {
        const taskStart = new Date(task.dueDate); // simplified to due date
        const taskDuration = 10; // simplified duration in days
        
        const offset = (taskStart.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const left = (offset / duration) * 100;
        const width = (taskDuration / duration) * 100;

        return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
    };

    const taskColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
            <h3 className="text-lg font-semibold text-dark mb-4">Project Timeline</h3>
            <div className="relative" style={{ minWidth: '800px' }}>
                {/* Month Headers */}
                <div className="flex border-b-2 border-gray-200">
                    {timelineMonths.map((month, i) => (
                        <div key={`${month.name}-${month.year}`} className="text-center font-semibold text-sm text-gray-600 border-r" style={{ flexGrow: month.days }}>
                            {month.name} {month.year}
                        </div>
                    ))}
                </div>

                {/* Task Rows */}
                <div className="mt-4 space-y-2 pr-4">
                    {tasks.map((task, index) => {
                        const assignee = users.find(u => u.id === task.assigneeId);
                        const { left, width } = getTaskPosition(task);
                        return (
                            <div key={task.id} className="relative h-10 flex items-center">
                                <div className="absolute top-0 h-full w-full">
                                    <div 
                                        className={`absolute h-8 top-1 rounded ${taskColors[index % taskColors.length]} opacity-80 hover:opacity-100 transition-opacity group`} 
                                        style={{ left, width }}
                                    >
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                                        {task.title} <br/> Due: {new Date(task.dueDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                </div>
                                <div className="flex items-center w-48 flex-shrink-0 z-0">
                                    {assignee && <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full mr-2" title={assignee.name}/>}
                                    <p className="text-sm text-gray-700 truncate">{task.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectTimeline;
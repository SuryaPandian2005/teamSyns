import React, { useMemo } from 'react';
import { Project, Task, User } from '../types';
import { format, isWithinInterval, startOfDay } from 'date-fns';

interface ProjectTimelineProps {
    project: Project;
    tasks: Task[];
    users: User[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ project, tasks, users }) => {
    const { startDate, endDate, duration, timelineMonths, todayPosition } = useMemo(() => {
        const start = startOfDay(new Date(project.startDate));
        const end = startOfDay(new Date(project.endDate));
        const durationInDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
        
        const months = [];
        let current = new Date(start);
        current.setDate(1);

        while (current <= end) {
            months.push({
                name: current.toLocaleString('default', { month: 'short' }),
                year: current.getFullYear(),
                days: new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate(),
            });
            current.setMonth(current.getMonth() + 1);
        }

        let todayPos = null;
        const today = startOfDay(new Date());
        if (isWithinInterval(today, { start, end })) {
            const todayOffset = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
            todayPos = (todayOffset / durationInDays) * 100;
        }

        return { startDate: start, endDate: end, duration: durationInDays, timelineMonths: months, todayPosition: todayPos };
    }, [project.startDate, project.endDate]);

    const getTaskPosition = (task: Task) => {
        const taskStart = startOfDay(new Date(task.dueDate)); 
        const taskDuration = task.duration;
        
        const offset = (taskStart.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const left = (offset / duration) * 100;
        const width = (taskDuration / duration) * 100;

        return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
    };

    const taskColors = ['bg-accent-blue', 'bg-accent-green', 'bg-purple-500', 'bg-accent-yellow', 'bg-pink-500', 'bg-teal-500'];

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white">
            <h3 className="text-xl font-semibold text-dark mb-4">Project Timeline</h3>
            <div className="flex">
                {/* Left Column: Task List */}
                <div className="w-64 flex-shrink-0 border-r border-gray-200 pr-4">
                    <div className="h-10 flex items-center">
                         <p className="text-sm font-semibold text-gray-600">Tasks</p>
                    </div>
                    <div className="space-y-2 mt-2">
                        {tasks.map(task => {
                            const assignee = users.find(u => u.id === task.assigneeId);
                            return (
                                <div key={task.id} className="h-10 flex items-center bg-gray-50/80 rounded-l-md px-2">
                                     {assignee && <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full mr-2 flex-shrink-0" title={assignee.name}/>}
                                    <p className="text-sm text-gray-800 truncate" title={task.title}>{task.title}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Timeline Grid */}
                <div className="flex-grow overflow-x-auto">
                    <div className="relative" style={{ minWidth: '800px' }}>
                        {/* Month Headers */}
                        <div className="flex border-b-2 border-gray-200 h-10">
                            {timelineMonths.map((month, i) => (
                                <div key={`${month.name}-${month.year}`} className="text-center font-semibold text-sm text-gray-600 border-r flex items-center justify-center" style={{ flexGrow: month.days }}>
                                    {month.name} '{String(month.year).slice(2)}
                                </div>
                            ))}
                        </div>

                        {/* Task Bars container */}
                        <div className="relative mt-2 space-y-2">
                             {/* Today Marker */}
                            {todayPosition !== null && (
                                <div className="absolute top-0 h-full z-20" style={{ left: `${todayPosition}%` }}>
                                    <div className="w-0.5 h-full bg-red-500"></div>
                                    <div className="absolute -top-6 -translate-x-1/2 bg-red-500 text-white text-xs font-bold py-0.5 px-2 rounded-full">
                                        Today
                                    </div>
                                </div>
                            )}

                            {tasks.map((task, index) => {
                                const { left, width } = getTaskPosition(task);
                                return (
                                    <div key={task.id} className="relative h-10 flex items-center group">
                                        <div 
                                            className={`absolute h-8 top-1 rounded-md ${taskColors[index % taskColors.length]} transition-all duration-200 ease-in-out hover:scale-105 hover:z-10`} 
                                            style={{ left, width }}
                                        >
                                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-max bg-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10 shadow-lg">
                                            <p className="font-bold">{task.title}</p>
                                            <p>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
                                          </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTimeline;
import React, { useState, useMemo } from 'react';
import { Project, Task, TaskStatus, User } from '../types';
import TaskList from './TaskList';
import ProjectTimeline from './ProjectTimeline';

interface ProjectViewProps {
    project: Project;
    allTasks: Task[];
    allUsers: User[];
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, allTasks, allUsers }) => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'timeline'>('tasks');

    const projectTasks = useMemo(() => allTasks.filter(task => task.projectId === project.id), [project.id, allTasks]);

    const getProjectProgress = (tasks: Task[]) => {
        if (tasks.length === 0) return 0;
        const doneTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
        return Math.round((doneTasks / tasks.length) * 100);
    };

    const progress = getProjectProgress(projectTasks);
    const members = allUsers.filter(u => project.members.includes(u.id));

    return (
        <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-dark">{project.name}</h1>
                        <p className="text-secondary mt-1">{project.description}</p>
                    </div>
                    <div className="flex -space-x-2">
                        {members.map(member => (
                            <img
                                key={member.id}
                                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                src={member.avatarUrl}
                                alt={member.name}
                                title={member.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-secondary">Progress</span>
                        <span className="text-sm font-medium text-primary">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'tasks'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'timeline'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Timeline
                        </button>
                    </nav>
                </div>
                <div className="mt-6">
                    {activeTab === 'tasks' && <TaskList tasks={projectTasks} users={allUsers} />}
                    {activeTab === 'timeline' && <ProjectTimeline project={project} tasks={projectTasks} users={allUsers} />}
                </div>
            </div>
        </div>
    );
};

export default ProjectView;
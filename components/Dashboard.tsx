import React from 'react';
import { Project, Task, TaskStatus, ViewType, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
    projects: Project[];
    tasks: Task[];
    users: User[];
    currentUser: User | null;
    onViewChange: (view: ViewType, projectId?: string) => void;
}

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Done: return 'text-accent-green';
        case TaskStatus.InProgress: return 'text-accent-blue';
        case TaskStatus.ToDo: return 'text-secondary';
        default: return 'text-gray-500';
    }
};

const getProjectProgress = (projectId: string, tasks: Task[]) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const doneTasks = projectTasks.filter(t => t.status === TaskStatus.Done).length;
    return Math.round((doneTasks / projectTasks.length) * 100);
};

const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white transition-transform duration-300 ease-in-out hover:scale-[1.03] ${className}`}>
        {children}
    </div>
);

const TaskOverviewChart: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const data = [
        { name: 'To Do', value: tasks.filter(t => t.status === TaskStatus.ToDo).length, color: '#6B7280' },
        { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.InProgress).length, color: '#3B82F6' },
        { name: 'Done', value: tasks.filter(t => t.status === TaskStatus.Done).length, color: '#10B981' },
    ];

    return (
        <Card>
            <h3 className="text-lg font-semibold text-dark mb-4">Tasks Overview</h3>
            {tasks.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[250px] text-gray-500">
                    <p>No task data to display.</p>
                </div>
            )}
        </Card>
    );
};

const ProjectProgressChart: React.FC<{ projects: Project[], tasks: Task[] }> = ({ projects, tasks }) => {
    const data = projects.map(p => ({
        name: p.name.length > 15 ? `${p.name.substring(0, 15)}...` : p.name,
        progress: getProjectProgress(p.id, tasks),
    }));

    return (
        <Card>
            <h3 className="text-lg font-semibold text-dark mb-4">Project Progress</h3>
            {projects.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis dataKey="name" type="category" width={100} interval={0} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="progress" fill="#4F46E5" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                 <div className="flex items-center justify-center h-[250px] text-gray-500">
                    <p>No project data to display.</p>
                </div>
            )}
        </Card>
    );
};

const MyProjectsWidget: React.FC<{ projects: Project[], tasks: Task[], users: User[], onViewChange: (view: ViewType, projectId?: string) => void }> = ({ projects, tasks, users, onViewChange }) => {
    return (
        <Card>
            <h3 className="text-lg font-semibold text-dark mb-4">My Projects</h3>
            <div className="space-y-4">
                {projects.length > 0 ? projects.map(project => {
                    const progress = getProjectProgress(project.id, tasks);
                    const projectMembers = users.filter(u => project.members.includes(u.id));
                    return (
                        <div key={project.id} className="p-4 bg-slate-50/80 rounded-lg hover:bg-slate-100 transition-all duration-300 cursor-pointer hover:scale-[1.02] transform" onClick={() => onViewChange(ViewType.Project, project.id)}>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-dark">{project.name}</h4>
                                <span className="text-sm font-bold text-primary">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{projectMembers.length} Members</span>
                                <div className="flex -space-x-2">
                                    {projectMembers.slice(0, 4).map(m => (
                                        <img key={m.id} src={m.avatarUrl} title={m.name} className="w-6 h-6 rounded-full ring-2 ring-white" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-sm text-gray-500 py-10">You are not assigned to any projects.</div>
                )}
            </div>
        </Card>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ projects, tasks, users, currentUser, onViewChange }) => {
    const userFirstName = currentUser?.name.split(' ')[0];
    
    const myTasks = currentUser ? tasks.filter(t => t.assigneeId === currentUser.id) : [];
    const myProjects = currentUser ? projects.filter(p => p.members.includes(currentUser!.id)) : [];
    const overdueTasks = myTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== TaskStatus.Done).length;
    const completedTasks = myTasks.filter(t => t.status === TaskStatus.Done).length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-dark tracking-tight">{currentUser ? `Welcome back, ${userFirstName}!` : 'Welcome to TeamSync!'}</h1>
                <p className="text-secondary mt-1 text-lg">{currentUser ? "Here's your project summary for today." : "Log in to manage your projects and collaborate with your team."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-xl shadow-lg text-white flex items-center transition-transform duration-300 ease-in-out hover:scale-[1.03]">
                    <div className="p-3 rounded-full bg-white/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
                    <div className="ml-4">
                        <p className="text-sm text-indigo-200">My Projects</p>
                        <p className="text-2xl font-semibold">{currentUser ? myProjects.length : '-'}</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 p-6 rounded-xl shadow-lg text-white flex items-center transition-transform duration-300 ease-in-out hover:scale-[1.03]">
                    <div className="p-3 rounded-full bg-white/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div className="ml-4">
                        <p className="text-sm text-green-200">Tasks Completed</p>
                        <p className="text-2xl font-semibold">{currentUser ? completedTasks : '-'}</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-6 rounded-xl shadow-lg text-white flex items-center transition-transform duration-300 ease-in-out hover:scale-[1.03]">
                    <div className="p-3 rounded-full bg-white/20"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div className="ml-4">
                        <p className="text-sm text-red-200">Overdue Tasks</p>
                        <p className="text-2xl font-semibold">{currentUser ? overdueTasks : '-'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <TaskOverviewChart tasks={currentUser ? tasks : []} />
                 <ProjectProgressChart projects={currentUser ? projects : []} tasks={currentUser ? tasks : []} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-dark mb-4">My Tasks</h3>
                        {currentUser ? (
                            <div className="space-y-4">
                                {myTasks.slice(0, 5).map(task => {
                                    const project = projects.find(p => p.id === task.projectId);
                                    return (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg">
                                            <div>
                                                <p className="font-medium text-dark">{task.title}</p>
                                                <p className="text-xs text-secondary">{project?.name}</p>
                                            </div>
                                            <span className={`text-sm font-semibold ${getStatusColor(task.status)}`}>{task.status}</span>
                                        </div>
                                    );
                                })}
                                {myTasks.length === 0 && (
                                    <div className="text-center text-sm text-gray-500 py-10">You have no assigned tasks.</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-sm text-gray-500 py-10">
                                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <p className="mt-2">Please log in to view your assigned tasks.</p>
                            </div>
                        )}
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    {currentUser ? (
                        <MyProjectsWidget projects={myProjects} tasks={tasks} users={users} onViewChange={onViewChange} />
                    ) : (
                         <Card className="h-full flex flex-col items-center justify-center text-center">
                             <div className="text-sm text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                <p className="mt-2">Log in to see your projects.</p>
                                <p className="text-xs">Projects you are a member of will appear here.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
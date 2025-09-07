import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import { ViewType, User, Project, Task, Notification, Activity, ActivityType, TaskStatus } from './types';
import { mockUsers as initialUsers, mockProjects as initialProjects, mockTasks as initialTasks, mockNotifications as initialNotifications, mockActivities as initialActivities } from './constants';
import CreateTaskModal from './components/CreateTaskModal';
import Login from './components/Login';
import CreateProjectModal from './components/CreateProjectModal';
import TeamView from './components/TeamView';
import ProfileView from './components/ProfileView';
import CalendarView from './components/CalendarView';
import { format } from 'date-fns';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [activities, setActivities] = useState<Activity[]>(initialActivities);

    const [currentView, setCurrentView] = useState<ViewType>(ViewType.Dashboard);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLogin = useCallback((username: string, password: string) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            setIsLoginModalOpen(false);
            return true;
        }
        return false;
    }, [users]);

     const handleRegister = useCallback((name: string, username: string, password: string) => {
        if (users.some(u => u.username === username)) {
            return { success: false, message: 'Username already exists.' };
        }
        const newUser: User = {
            id: `u${Date.now()}`,
            name,
            username,
            password,
            avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
            isAdmin: false
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setIsLoginModalOpen(false);
        return { success: true };
    }, [users]);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setCurrentView(ViewType.Dashboard);
    }, []);

    const handleViewChange = useCallback((view: ViewType, projectId?: string) => {
        if (!currentUser && ![ViewType.Dashboard, ViewType.Profile].includes(view)) return;
        setCurrentView(view);
        if (view === ViewType.Project && projectId) {
            setSelectedProjectId(projectId);
        } else if (view === ViewType.Dashboard) {
            setSelectedProjectId(null);
        }
    }, [currentUser]);

    const handleCreateProject = useCallback((newProjectData: Omit<Project, 'id'>) => {
        const newProject: Project = {
            ...newProjectData,
            id: `p${Date.now()}`,
        };
        setProjects(prev => [...prev, newProject]);
        setIsProjectModalOpen(false);
        handleViewChange(ViewType.Project, newProject.id);
    }, [handleViewChange]);
    
    const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
        const newActivity: Activity = {
            ...activity,
            id: `a${Date.now()}${Math.random()}`,
        };
        setActivities(prev => [newActivity, ...prev]);
    }, []);

    const handleCreateTask = useCallback((taskData: Omit<Task, 'id' | 'creatorId'>) => {
        if (!currentUser) return;
        const newTask: Task = {
            ...taskData,
            id: `t${Date.now()}`,
            creatorId: currentUser.id,
        };
        setTasks(prev => [...prev, newTask]);
        addActivity({
            type: ActivityType.TaskCreate,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            projectId: newTask.projectId,
            taskId: newTask.id,
            details: { taskTitle: newTask.title }
        });
        setIsTaskModalOpen(false);
    }, [currentUser, addActivity]);

    const handleUpdateTask = useCallback((updatedTask: Task) => {
        const originalTask = tasks.find(t => t.id === updatedTask.id);
        if (!originalTask || !currentUser) return;

        const newNotifications: Notification[] = [];

        const createNotification = (message: string): Notification => {
            return {
                id: `n${Date.now()}${Math.random()}`,
                type: 'update',
                message,
                user: {
                    name: currentUser.name,
                    avatarUrl: currentUser.avatarUrl,
                },
                timestamp: new Date().toISOString(),
                isRead: false,
            };
        }

        if (originalTask.status !== updatedTask.status) {
            newNotifications.push(createNotification(`changed status to "${updatedTask.status}" for task "${originalTask.title}"`));
            addActivity({
                type: ActivityType.TaskUpdateStatus,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                projectId: updatedTask.projectId,
                taskId: updatedTask.id,
                details: { taskTitle: updatedTask.title, from: originalTask.status, to: updatedTask.status }
            });
        }
        if (originalTask.priority !== updatedTask.priority) {
            newNotifications.push(createNotification(`set priority to "${updatedTask.priority}" for task "${originalTask.title}"`));
            addActivity({
                type: ActivityType.TaskUpdatePriority,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                projectId: updatedTask.projectId,
                taskId: updatedTask.id,
                details: { taskTitle: updatedTask.title, from: originalTask.priority, to: updatedTask.priority }
            });
        }
        if (originalTask.dueDate.split('T')[0] !== updatedTask.dueDate.split('T')[0]) {
             newNotifications.push(createNotification(`updated due date to ${format(new Date(updatedTask.dueDate), 'MMM d')} for task "${originalTask.title}"`));
             addActivity({
                type: ActivityType.TaskUpdateDueDate,
                timestamp: new Date().toISOString(),
                userId: currentUser.id,
                projectId: updatedTask.projectId,
                taskId: updatedTask.id,
                details: { 
                    taskTitle: updatedTask.title, 
                    from: format(new Date(originalTask.dueDate), 'MMM d'), 
                    to: format(new Date(updatedTask.dueDate), 'MMM d')
                }
            });
        }
        if (originalTask.assigneeId !== updatedTask.assigneeId) {
            const newAssignee = users.find(u => u.id === updatedTask.assigneeId);
            const oldAssignee = users.find(u => u.id === originalTask.assigneeId);
            if (newAssignee) {
                 newNotifications.push(createNotification(`reassigned task "${originalTask.title}" to ${newAssignee.name}`));
                 addActivity({
                    type: ActivityType.TaskUpdateAssignee,
                    timestamp: new Date().toISOString(),
                    userId: currentUser.id,
                    projectId: updatedTask.projectId,
                    taskId: updatedTask.id,
                    details: { 
                        taskTitle: updatedTask.title, 
                        from: oldAssignee?.name || 'Unassigned', 
                        to: newAssignee.name 
                    }
                });
            }
        }

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev]);
        }

        setTasks(prevTasks => prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
        ));
    }, [tasks, currentUser, users, addActivity]);

    const handleDeleteTask = useCallback((taskId: string) => {
        const taskToDelete = tasks.find(t => t.id === taskId);
        if (!taskToDelete || !currentUser) return;
        
        addActivity({
            type: ActivityType.TaskDelete,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            projectId: taskToDelete.projectId,
            taskId: taskToDelete.id,
            details: { taskTitle: taskToDelete.title }
        });
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }, [tasks, currentUser, addActivity]);

    const handleUpdateUser = useCallback((userId: string, updates: Partial<User> & { currentPassword?: string }) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate) {
            return { success: false, message: 'User not found.' };
        }

        if (updates.password) {
            if (!updates.currentPassword || userToUpdate.password !== updates.currentPassword) {
                return { success: false, message: 'Incorrect current password.' };
            }
        }
        
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                const updatedUser = { ...user, ...updates };
                delete (updatedUser as any).currentPassword;
                return updatedUser;
            }
            return user;
        });

        setUsers(updatedUsers);

        if (currentUser?.id === userId) {
             const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
             if (updatedCurrentUser) {
                setCurrentUser(updatedCurrentUser);
             }
        }
        
        return { success: true, message: 'Profile updated successfully.' };

    }, [users, currentUser]);


    const renderContent = () => {
        if (!currentUser && ![ViewType.Dashboard, ViewType.Calendar].includes(currentView)) {
             handleViewChange(ViewType.Dashboard);
        }

        switch (currentView) {
            case ViewType.Dashboard:
                return <Dashboard 
                            projects={projects} 
                            tasks={tasks} 
                            users={users}
                            currentUser={currentUser}
                            onViewChange={handleViewChange} 
                        />;
            case ViewType.Project:
                const project = projects.find(p => p.id === selectedProjectId);
                return project ? <ProjectView 
                                    project={project} 
                                    allTasks={tasks}
                                    allActivities={activities}
                                    allUsers={users} 
                                    onUpdateTask={handleUpdateTask}
                                    onDeleteTask={handleDeleteTask}
                                /> : <div>Project not found</div>;
            case ViewType.Team:
                return <TeamView users={users} currentUser={currentUser!} />;
            case ViewType.Profile:
                return currentUser ? <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} /> : <div>Please log in to see your profile.</div>;
            case ViewType.Calendar:
                return <CalendarView projects={projects} tasks={tasks} />;
            default:
                return <Dashboard 
                            projects={projects} 
                            tasks={tasks} 
                            users={users}
                            currentUser={currentUser}
                            onViewChange={handleViewChange} 
                        />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 text-gray-800 font-sans">
            <style>{`
                @keyframes animate-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
            <div 
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 opacity-50"
                style={{ backgroundSize: '200% 200%', animation: 'animate-gradient 15s ease infinite' }}
            />
            <Sidebar 
                user={currentUser}
                projects={projects}
                currentView={currentView} 
                onViewChange={handleViewChange}
                onAddProjectClick={() => setIsProjectModalOpen(true)}
            />
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <Header 
                    user={currentUser} 
                    onCreateTaskClick={() => setIsTaskModalOpen(true)}
                    onLogout={handleLogout} 
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    projects={projects}
                    tasks={tasks}
                    notifications={notifications}
                    onViewChange={handleViewChange}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                   <div key={currentView + (selectedProjectId || '')} className="animate-content-fade-in">
                       {renderContent()}
                    </div>
                </main>
            </div>
            {isTaskModalOpen && currentUser && (
                <CreateTaskModal
                    onClose={() => setIsTaskModalOpen(false)}
                    onCreate={handleCreateTask}
                    projects={projects}
                    users={users}
                    defaultProjectId={selectedProjectId}
                />
            )}
            {isProjectModalOpen && currentUser?.isAdmin && (
                <CreateProjectModal
                    users={users}
                    onClose={() => setIsProjectModalOpen(false)}
                    onCreate={handleCreateProject}
                />
            )}
            {isLoginModalOpen && (
                <Login
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    users={users}
                    onClose={() => setIsLoginModalOpen(false)}
                />
            )}
        </div>
    );
};

export default App;
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import { ViewType, User, Project, Task, Notification } from './types';
import { mockUsers as initialUsers, mockProjects as initialProjects, mockTasks as initialTasks, mockNotifications as initialNotifications } from './constants';
import CreateTaskModal from './components/CreateTaskModal';
import Login from './components/Login';
import CreateProjectModal from './components/CreateProjectModal';
import TeamView from './components/TeamView';
import ProfileView from './components/ProfileView';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

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

    const handleCreateTask = useCallback((newTaskData: Omit<Task, 'id'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: `t${Date.now()}`,
        };
        setTasks(prev => [...prev, newTask]);
        setIsTaskModalOpen(false);
    }, []);

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
        if (!currentUser && currentView !== ViewType.Dashboard) {
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
                return project ? <ProjectView project={project} allTasks={tasks} allUsers={users} /> : <div>Project not found</div>;
            case ViewType.Team:
                return <TeamView users={users} currentUser={currentUser!} />;
            case ViewType.Profile:
                return currentUser ? <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} /> : <div>Please log in to see your profile.</div>;
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
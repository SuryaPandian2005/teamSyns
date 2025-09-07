import React from 'react';
import { ViewType, User, Project } from '../types';

interface SidebarProps {
    currentView: ViewType;
    onViewChange: (view: ViewType, projectId?: string) => void;
    user: User | null;
    projects: Project[];
    onAddProjectClick: () => void;
}

const NavLink: React.FC<{ icon: JSX.Element; label: string; isActive: boolean; onClick: () => void; disabled?: boolean }> = ({ icon, label, isActive, onClick, disabled }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); if(!disabled) onClick(); }}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive
                ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg'
                : disabled 
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </a>
);

const ProjectLink: React.FC<{ name: string; onClick: () => void, color: string }> = ({ name, onClick, color }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        className="flex items-center px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-lg"
    >
        <span className={`w-2.5 h-2.5 rounded-full ${color} mr-3`}></span>
        {name}
    </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user, projects, onAddProjectClick }) => {
    const projectColors = ['bg-accent-blue', 'bg-accent-green', 'bg-accent-yellow', 'bg-accent-red'];
    const isLoggedIn = !!user;

    return (
        <aside className="w-64 flex-shrink-0 bg-white/70 backdrop-blur-lg border-r border-gray-200/80 flex flex-col relative z-20">
            <div className="h-16 flex items-center px-6 border-b border-gray-200/80">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <h1 className="ml-3 text-xl font-bold text-dark">TeamSync</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                    label="Dashboard"
                    isActive={currentView === ViewType.Dashboard}
                    onClick={() => onViewChange(ViewType.Dashboard)}
                />
                 <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                    label="Tasks"
                    isActive={currentView === ViewType.Tasks}
                    onClick={() => onViewChange(ViewType.Tasks)}
                    disabled={!isLoggedIn}
                />
                <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>}
                    label="Team"
                    isActive={currentView === ViewType.Team}
                    onClick={() => onViewChange(ViewType.Team)}
                    disabled={!isLoggedIn}
                />
                 <NavLink
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    label="Calendar"
                    isActive={currentView === ViewType.Calendar}
                    onClick={() => onViewChange(ViewType.Calendar)}
                    disabled={!isLoggedIn}
                />

                {isLoggedIn && (
                    <div className="pt-4">
                        <div className="flex justify-between items-center px-4 mb-2">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</h2>
                            {user.isAdmin && (
                                <button onClick={onAddProjectClick} title="Add New Project" className="flex items-center justify-center w-6 h-6 rounded-md text-primary bg-indigo-100 hover:bg-indigo-200 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {projects.map((project, index) => (
                                 <ProjectLink 
                                    key={project.id} 
                                    name={project.name} 
                                    color={projectColors[index % projectColors.length]}
                                    onClick={() => onViewChange(ViewType.Project, project.id)} />
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
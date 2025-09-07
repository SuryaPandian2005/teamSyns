import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Project, Task, Notification, ViewType } from '../types';
import NotificationsPanel from './NotificationsPanel';
import SearchResults from './SearchResults';

interface HeaderProps {
    user: User | null;
    onCreateTaskClick: () => void;
    onLogout: () => void;
    onLoginClick: () => void;
    projects: Project[];
    tasks: Task[];
    notifications: Notification[];
    onViewChange: (view: ViewType, id?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onCreateTaskClick, onLogout, onLoginClick, projects, tasks, notifications, onViewChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setDropdownOpen(false);
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setNotificationsOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchResults = useMemo(() => {
        if (!searchQuery) return { projects: [], tasks: [] };
        const lowercasedQuery = searchQuery.toLowerCase();
        const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(lowercasedQuery));
        const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(lowercasedQuery));
        return { projects: filteredProjects, tasks: filteredTasks };
    }, [searchQuery, projects, tasks]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSearchOpen(e.target.value.length > 0);
    }
    
    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="h-16 bg-white/70 backdrop-blur-lg border-b border-gray-200/80 flex-shrink-0">
            <div className="flex items-center justify-between h-full px-6">
                <div className="relative" ref={searchRef}>
                    <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Search tasks or projects..." 
                        className="pl-10 pr-4 py-2 w-64 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary relative" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery.length > 0 && setSearchOpen(true)}
                    />
                    {searchOpen && (searchResults.projects.length > 0 || searchResults.tasks.length > 0) && (
                       <SearchResults 
                            results={searchResults} 
                            onViewChange={onViewChange}
                            onClose={() => setSearchOpen(false)}
                        />
                    )}
                </div>
                <div className="flex items-center space-x-5">
                    {user ? (
                        <>
                            <button onClick={onCreateTaskClick} className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                Create Task
                            </button>
                            <div className="relative" ref={notificationsRef}>
                                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="text-gray-500 hover:text-gray-900 relative">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </button>
                                {notificationsOpen && <NotificationsPanel notifications={notifications} />}
                            </div>
                            <div className="relative" ref={dropdownRef}>
                                <div className="flex items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div className="ml-3 text-sm">
                                        <div className="font-medium text-dark">{user.name}</div>
                                        <div className="text-gray-500">{user.isAdmin ? 'Project Admin' : 'Team Member'}</div>
                                    </div>
                                    <svg className={`w-5 h-5 ml-1 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewChange(ViewType.Profile); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={onLoginClick} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200">
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
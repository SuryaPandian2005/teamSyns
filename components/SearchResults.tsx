import React from 'react';
import { Project, Task, ViewType } from '../types';

interface SearchResultsProps {
    results: {
        projects: Project[];
        tasks: Task[];
    };
    onViewChange: (view: ViewType, id?: string) => void;
    onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onViewChange, onClose }) => {
    const handleProjectClick = (projectId: string) => {
        onViewChange(ViewType.Project, projectId);
        onClose();
    };

    return (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 animate-fade-in-down overflow-hidden">
             <style>{`.animate-fade-in-down { animation: fadeInDown 0.2s ease-out; } @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="max-h-96 overflow-y-auto">
                {results.projects.length > 0 && (
                    <div>
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">Projects</h3>
                        <ul>
                            {results.projects.map(project => (
                                <li key={project.id} onClick={() => handleProjectClick(project.id)} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white cursor-pointer flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <span>{project.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                 {results.tasks.length > 0 && (
                    <div>
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-t border-gray-200">Tasks</h3>
                        <ul>
                            {results.tasks.map(task => (
                                <li key={task.id} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-primary hover:text-white cursor-pointer flex items-center space-x-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    <span>{task.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;

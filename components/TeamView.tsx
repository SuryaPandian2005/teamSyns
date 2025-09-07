import React from 'react';
import { User } from '../types';

interface TeamViewProps {
    users: User[];
    currentUser: User;
}

const UserCard: React.FC<{ user: User; isAdminView: boolean }> = ({ user, isAdminView }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden text-center">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 h-20 relative">
            <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mx-auto -mt-12 border-4 border-white shadow-lg"
            />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-semibold text-dark">{user.name}</h3>
            <p className="text-secondary text-sm">@{user.username}</p>
            <div className="mt-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.isAdmin ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {user.isAdmin ? 'Project Admin' : 'Team Member'}
                </span>
            </div>
        </div>
        {isAdminView && !user.isAdmin && (
             <div className="border-t border-gray-200 p-2 flex justify-center space-x-2 bg-gray-50">
                <button title="Edit User" className="p-2 rounded-full text-gray-400 hover:bg-indigo-100 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                </button>
                 <button title="Remove User" className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        )}
    </div>
);

const TeamView: React.FC<TeamViewProps> = ({ users, currentUser }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dark">Meet the Team</h1>
                <p className="text-secondary mt-1">An overview of all the members collaborating in TeamSync.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map(user => (
                    <UserCard key={user.id} user={user} isAdminView={currentUser.isAdmin || false} />
                ))}
            </div>
        </div>
    );
};

export default TeamView;
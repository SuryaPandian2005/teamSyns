import React, { useState } from 'react';
import { User } from '../types';

interface ProfileViewProps {
    user: User;
    onUpdateUser: (userId: string, updates: Partial<User> & { currentPassword?: string }) => { success: boolean, message: string };
}

const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white ${className}`}>
        {children}
    </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage(null);
        if (name.trim() === '') {
            setProfileMessage({ type: 'error', text: 'Name cannot be empty.'});
            return;
        }
        if (name === user.name) {
             setProfileMessage({ type: 'error', text: 'No changes detected.'});
            return;
        }

        const result = onUpdateUser(user.id, { name });
        setProfileMessage({ type: result.success ? 'success' : 'error', text: result.message });
        setTimeout(() => setProfileMessage(null), 3000);
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'All password fields are required.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
             setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        const result = onUpdateUser(user.id, { password: newPassword, currentPassword });
        setPasswordMessage({ type: result.success ? 'success' : 'error', text: result.message });
        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setTimeout(() => setPasswordMessage(null), 3000);
    };

    const Message: React.FC<{ message: { type: 'success' | 'error', text: string } | null }> = ({ message }) => {
        if (!message) return null;
        const baseClasses = "text-sm p-3 rounded-md mt-4";
        const typeClasses = message.type === 'success' 
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
        return <div className={`${baseClasses} ${typeClasses}`}>{message.text}</div>;
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dark">My Profile</h1>
                <p className="text-secondary mt-1">Manage your personal details and account settings.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <Card className="text-center">
                        <img 
                            src={user.avatarUrl} 
                            alt={user.name} 
                            className="w-32 h-32 rounded-full mx-auto ring-4 ring-primary/20 shadow-lg"
                        />
                        <button className="text-sm text-primary hover:underline mt-3">Change Photo</button>
                        <h2 className="text-2xl font-bold text-dark mt-4">{user.name}</h2>
                        <p className="text-secondary">@{user.username}</p>
                         <div className="mt-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.isAdmin ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {user.isAdmin ? 'Project Admin' : 'Team Member'}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Details Form */}
                    <Card>
                        <form onSubmit={handleProfileUpdate}>
                            <h3 className="text-lg font-semibold text-dark border-b pb-3 mb-4">Personal Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="fullName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                 <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username (cannot be changed)</label>
                                    <input type="text" id="username" value={user.username} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="mt-6 text-right">
                                <button type="submit" className="px-5 py-2.5 bg-primary border border-transparent rounded-md text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                                    Save Changes
                                </button>
                            </div>
                            <Message message={profileMessage} />
                        </form>
                    </Card>

                    {/* Change Password Form */}
                    <Card>
                        <form onSubmit={handlePasswordUpdate}>
                            <h3 className="text-lg font-semibold text-dark border-b pb-3 mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword"  className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                            <div className="mt-6 text-right">
                                <button type="submit" className="px-5 py-2.5 bg-primary border border-transparent rounded-md text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                                    Update Password
                                </button>
                            </div>
                            <Message message={passwordMessage} />
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;

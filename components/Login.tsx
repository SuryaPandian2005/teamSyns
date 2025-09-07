import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
    onLogin: (username: string, password: string) => boolean;
    onRegister: (name: string, username: string, password: string) => { success: boolean, message?: string };
    users: User[];
    onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, users, onClose }) => {
    const [view, setView] = useState<'profiles' | 'password' | 'loginForm' | 'registerForm'>('profiles');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Login state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Register state
    const [registerName, setRegisterName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [error, setError] = useState('');

    const handleProfileSelect = (user: User) => {
        setSelectedUser(user);
        setLoginPassword('');
        setError('');
        setView('password');
    };

    const handlePasswordLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        const success = onLogin(selectedUser.username, loginPassword);
        if (!success) {
            setError('Incorrect password. Please try again.');
        }
    };
    
    const handleUsernameLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(loginUsername, loginPassword);
        if (!success) {
            setError('Invalid username or password.');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!registerName || !registerUsername || !registerPassword) {
            setError('All fields are required.');
            return;
        }
        const result = onRegister(registerName, registerUsername, registerPassword);
        if (!result.success) {
            setError(result.message || 'Registration failed.');
        }
    };
    
    const resetState = () => {
        setError('');
        setLoginUsername('');
        setLoginPassword('');
        setRegisterName('');
        setRegisterUsername('');
        setRegisterPassword('');
        setSelectedUser(null);
    }
    
    const changeView = (newView: typeof view) => {
        resetState();
        setView(newView);
    }

    const renderContent = () => {
        switch (view) {
            case 'password':
                if (!selectedUser) return null;
                return (
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                        <div className="text-center">
                            <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-dark/20 shadow-md mb-4 mx-auto" />
                            <h2 className="text-2xl font-bold text-dark">{selectedUser.name}</h2>
                            <p className="text-secondary mb-6">Enter your password to log in</p>
                        </div>
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div>
                                 <label htmlFor="modal-password" className="sr-only">Password</label>
                                 <input id="modal-password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required autoFocus className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-center" placeholder="Password"/>
                            </div>
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Log In
                                </button>
                            </div>
                        </form>
                        <button onClick={() => changeView('profiles')} className="mt-4 w-full text-center text-sm font-medium text-primary hover:text-primary-dark">
                            &larr; Back to profiles
                        </button>
                    </div>
                );
            case 'loginForm':
                return (
                    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-dark tracking-tight">Log In</h1>
                             <p className="mt-1 text-sm text-secondary">Enter your credentials</p>
                        </div>
                        <form onSubmit={handleUsernameLogin} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input id="username" type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input id="password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Log In
                                </button>
                            </div>
                            <p className="text-center text-sm text-gray-600">
                                <button type="button" onClick={() => changeView('profiles')} className="font-medium text-primary hover:text-primary-dark">
                                    &larr; Back to profiles
                                </button>
                            </p>
                        </form>
                    </div>
                );
            case 'registerForm':
                 return (
                     <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                         <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-dark tracking-tight">Create Account</h1>
                             <p className="mt-1 text-sm text-secondary">Join the team!</p>
                        </div>
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input id="name" type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input id="reg-username" type="text" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <div>
                                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input id="reg-password" type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Register
                                </button>
                            </div>
                            <p className="text-center text-sm text-gray-600">
                                <button type="button" onClick={() => changeView('profiles')} className="font-medium text-primary hover:text-primary-dark">
                                    &larr; Back to profiles
                                </button>
                            </p>
                        </form>
                    </div>
                );
            case 'profiles':
            default:
                return (
                     <div className="w-full max-w-2xl text-center bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-dark tracking-tight">Welcome to TeamSync</h1>
                            <p className="mt-1 text-sm text-secondary">Select your profile to continue</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {users.map(user => (
                                <div key={user.id} onClick={() => handleProfileSelect(user)} className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200 group">
                                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-100 shadow-md mb-3 transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/50 group-hover:scale-105" />
                                    <span className="font-semibold text-gray-800">{user.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 space-x-4">
                            <button type="button" onClick={() => changeView('loginForm')} className="font-medium text-primary hover:text-primary-dark">
                                Not you? Log in with username
                            </button>
                            <span className="text-gray-300">|</span>
                             <button type="button" onClick={() => changeView('registerForm')} className="font-medium text-primary hover:text-primary-dark">
                                Create an account
                            </button>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 font-sans" onClick={onClose}>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
            
            <div onClick={e => e.stopPropagation()} className="relative">
                 <button onClick={onClose} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors z-10 shadow-md">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               <div key={view}>
                    {renderContent()}
               </div>
            </div>
        </div>
    );
};

export default Login;
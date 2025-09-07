import React, { useState } from 'react';
import { User, Project } from '../types';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreate: (projectData: Omit<Project, 'id'>) => void;
    users: User[];
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreate, users }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState<string[]>([]);

    const handleCreate = () => {
        if (!name || !description || members.length === 0) {
            alert('Please fill all fields and select at least one member.');
            return;
        }
        onCreate({
            name,
            description,
            members,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
        });
    };
    
    const handleMemberToggle = (userId: string) => {
        setMembers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform scale-95 animate-scale-in" style={{ animation: 'scale-in 0.3s ease-out forwards' }}>
                <style>{`
                    @keyframes scale-in {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
                `}</style>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-dark">Create New Project</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., QuantumLeap CRM" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="Add a short project description..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Members</label>
                        <div className="flex flex-wrap gap-3">
                            {users.map(user => (
                                <div key={user.id} onClick={() => handleMemberToggle(user.id)} className={`flex items-center space-x-2 p-2 rounded-full cursor-pointer border-2 transition-colors ${members.includes(user.id) ? 'border-primary bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                    <span className="text-sm font-medium text-gray-800">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="px-8 py-6 bg-gray-50 rounded-b-xl flex justify-end space-x-4">
                    <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleCreate} className="px-5 py-2.5 bg-primary border border-transparent rounded-md text-sm font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;

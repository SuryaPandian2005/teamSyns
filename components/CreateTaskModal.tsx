import React, { useState } from 'react';
import { Project, User, TaskPriority, Task, TaskStatus } from '../types';

interface CreateTaskModalProps {
    onClose: () => void;
    onCreate: (taskData: Omit<Task, 'id' | 'creatorId'>) => void;
    projects: Project[];
    users: User[];
    defaultProjectId?: string | null;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate, projects, users, defaultProjectId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');
    const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
    const [duration, setDuration] = useState(1);

    const handleCreate = () => {
        if (!title || !projectId || !assigneeId || !dueDate) {
            alert('Please fill all required fields.');
            return;
        }
        onCreate({
            title,
            description,
            status: TaskStatus.ToDo,
            priority,
            assigneeId,
            projectId,
            dueDate: new Date(dueDate).toISOString(),
            duration: Number(duration) || 1,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform" style={{ animation: 'scale-in 0.3s ease-out forwards' }}>
                 <style>{`
                    @keyframes scale-in {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-dark">Create New Task</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., Design homepage mockups" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="Add a more detailed description..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
                             <select id="assignee" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                             </select>
                        </div>
                         <div>
                             <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
                             <select id="project" value={projectId} onChange={e => setProjectId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" disabled={projects.length === 0}>
                                {projects.length === 0 ? (
                                    <option>Create a project first</option>
                                ) : (
                                    projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)
                                )}
                             </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                             <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                             <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                                <option value={TaskPriority.Low}>Low</option>
                                <option value={TaskPriority.Medium}>Medium</option>
                                <option value={TaskPriority.High}>High</option>
                             </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
                        <input type="number" id="duration" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., 5" />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Cancel
                    </button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" disabled={projects.length === 0}>
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
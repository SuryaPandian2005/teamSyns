import React, { useState, useEffect } from 'react';
import { User, TaskPriority, Task, TaskStatus } from '../types';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    users: User[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onUpdate, onDelete, users }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [assigneeId, setAssigneeId] = useState(task.assigneeId);
    const [dueDate, setDueDate] = useState(task.dueDate.split('T')[0]);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [duration, setDuration] = useState(task.duration);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
        setAssigneeId(task.assigneeId);
        setDueDate(task.dueDate.split('T')[0]);
        setPriority(task.priority);
        setStatus(task.status);
        setDuration(task.duration);
    }, [task]);

    const handleSave = () => {
        if (!title || !assigneeId || !dueDate) {
            alert('Please fill all required fields.');
            return;
        }
        onUpdate({
            ...task,
            title,
            description,
            status,
            priority,
            assigneeId,
            dueDate: new Date(dueDate).toISOString(),
            duration: Number(duration) || 1,
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            onDelete(task.id);
        }
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
                    <h2 className="text-xl font-semibold text-dark">Edit Task</h2>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Task Title</label>
                        <input type="text" id="edit-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
                            <select id="edit-assignee" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="edit-status" value={status} onChange={e => setStatus(e.target.value as TaskStatus)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                                {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" id="edit-dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select id="edit-priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                                <option value={TaskPriority.Low}>Low</option>
                                <option value={TaskPriority.Medium}>Medium</option>
                                <option value={TaskPriority.High}>High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
                        <input type="number" id="edit-duration" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-between items-center">
                    <button onClick={handleDelete} className="px-4 py-2 flex items-center space-x-2 border border-transparent rounded-md text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        <span>Delete Task</span>
                    </button>
                    <div className="flex space-x-3">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;
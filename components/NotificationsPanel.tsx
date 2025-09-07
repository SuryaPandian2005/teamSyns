import React from 'react';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
    notifications: Notification[];
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'completion':
            return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>;
        case 'comment':
            return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>;
        case 'assignment':
             return <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>;
        case 'update':
            return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center"><svg className="w-5 h-5 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>;
    }
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
            <style>{`.animate-fade-in-down { animation: fadeInDown 0.2s ease-out; } @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="p-3 border-b">
                <h3 className="text-sm font-semibold text-dark">Notifications</h3>
            </div>
            <div className="py-1 max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                    <a key={notification.id} href="#" className="flex items-start px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                         {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0"></div>}
                        <div className={`flex-shrink-0 ${notification.isRead ? 'ml-4' : ''}`}>
                            <NotificationIcon type={notification.type} />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">
                                <span className="font-semibold text-dark">{notification.user.name}</span> {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
            <div className="p-2 bg-gray-50 text-center">
                <a href="#" className="text-sm font-medium text-primary hover:underline">View all notifications</a>
            </div>
        </div>
    );
};

export default NotificationsPanel;
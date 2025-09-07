import React from 'react';
import { Activity, User, ActivityType } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLogProps {
    activities: Activity[];
    users: User[];
}

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
    const baseClasses = "w-10 h-10 rounded-lg flex items-center justify-center";
    let icon;

    switch (type) {
        case ActivityType.TaskCreate:
            icon = <div className={`${baseClasses} bg-green-100 text-green-600`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>;
            break;
        case ActivityType.TaskDelete:
            icon = <div className={`${baseClasses} bg-red-100 text-red-600`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>;
            break;
        case ActivityType.TaskUpdateStatus:
        case ActivityType.TaskUpdatePriority:
        case ActivityType.TaskUpdateDueDate:
        case ActivityType.TaskUpdateAssignee:
            icon = <div className={`${baseClasses} bg-blue-100 text-blue-600`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>;
            break;
        default:
            icon = <div className={`${baseClasses} bg-gray-100 text-gray-600`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
    }
    return icon;
};

const formatActivityMessage = (activity: Activity): React.ReactNode => {
    const { type, details } = activity;
    const taskTitle = <span className="font-semibold text-gray-800">"{details.taskTitle}"</span>;

    switch (type) {
        case ActivityType.TaskCreate:
            return <>created task {taskTitle}</>;
        case ActivityType.TaskDelete:
            return <>deleted task {taskTitle}</>;
        case ActivityType.TaskUpdateStatus:
            return <>changed status from <span className="font-semibold">{details.from}</span> to <span className="font-semibold">{details.to}</span> on task {taskTitle}</>;
        case ActivityType.TaskUpdatePriority:
            return <>set priority to <span className="font-semibold">{details.to}</span> on task {taskTitle}</>;
        case ActivityType.TaskUpdateDueDate:
            return <>updated the due date for task {taskTitle} to <span className="font-semibold">{details.to}</span></>;
        case ActivityType.TaskUpdateAssignee:
             return <>reassigned task {taskTitle} from <span className="font-semibold">{details.from}</span> to <span className="font-semibold">{details.to}</span></>;
        default:
            return 'made an update.';
    }
};

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, users }) => {
    if (activities.length === 0) {
        return (
            <div className="text-center text-gray-500 bg-white/80 p-12 rounded-xl">
                No activity has been logged for this project yet.
            </div>
        );
    }
    
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white">
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => {
                        const user = users.find(u => u.id === activity.userId);
                        if (!user) return null;

                        return (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {activityIdx !== activities.length - 1 ? (
                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <ActivityIcon type={activity.type} />
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-900">{user.name}</span>{' '}
                                                {formatActivityMessage(activity)}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default ActivityLog;

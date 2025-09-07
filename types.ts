export interface User {
    id: string;
    name: string;
    username: string;
    password?: string; // Optional for security on client-side
    avatarUrl: string;
    isAdmin?: boolean;
}

export enum TaskStatus {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Done = 'Done',
}

export enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string;
    projectId: string;
    creatorId: string;
    dueDate: string; // ISO string
    duration: number; // in days
    isBlocked?: boolean;
}

export interface Project {
    id:string;
    name: string;
    description: string;
    members: string[]; // array of user ids
    startDate: string; // ISO string
    endDate: string; // ISO string
}

export enum ViewType {
    Dashboard = 'Dashboard',
    Projects = 'Projects',
    Project = 'Project',
    Tasks = 'Tasks',
    Calendar = 'Calendar',
    Team = 'Team',
    Profile = 'Profile'
}

export interface Notification {
    id: string;
    type: 'comment' | 'completion' | 'assignment' | 'update';
    message: string;
    user: {
        name: string;
        avatarUrl: string;
    };
    timestamp: string; // ISO string
    isRead: boolean;
}

export enum ActivityType {
    TaskCreate = 'TASK_CREATE',
    TaskDelete = 'TASK_DELETE',
    TaskUpdateStatus = 'TASK_UPDATE_STATUS',
    TaskUpdatePriority = 'TASK_UPDATE_PRIORITY',
    TaskUpdateDueDate = 'TASK_UPDATE_DUEDATE',
    TaskUpdateAssignee = 'TASK_UPDATE_ASSIGNEE',
}

export interface Activity {
    id: string;
    type: ActivityType;
    timestamp: string; // ISO string
    userId: string;
    projectId: string;
    taskId: string;
    details: {
        taskTitle: string;
        from?: string;
        to?: string;
    };
}
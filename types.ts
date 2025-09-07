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
    dueDate: string; // ISO string
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
    type: 'comment' | 'completion' | 'assignment';
    message: string;
    user: {
        name: string;
        avatarUrl: string;
    };
    timestamp: string; // ISO string
    isRead: boolean;
}
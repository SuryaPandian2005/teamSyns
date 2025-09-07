import { User, Project, Task, TaskStatus, TaskPriority, Notification, Activity, ActivityType } from './types';

export const mockUsers: User[] = [
    { id: 'u1', name: 'Alex Morgan', username: 'headofman', password: 'admin123456', avatarUrl: 'https://picsum.photos/id/1005/100/100', isAdmin: true },
    { id: 'u2', name: 'Jordan Lee', username: 'jordan', password: 'password123', avatarUrl: 'https://picsum.photos/id/1011/100/100' },
    { id: 'u3', name: 'Casey Smith', username: 'casey', password: 'password123', avatarUrl: 'https://picsum.photos/id/1012/100/100' },
    { id: 'u4', name: 'Riley Jones', username: 'riley', password: 'password123', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
];

export const mockProjects: Project[] = [
    { 
        id: 'p1', 
        name: 'QuantumLeap CRM', 
        description: 'A next-generation CRM platform to revolutionize customer interactions.', 
        members: ['u1', 'u2', 'u3'], 
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    },
    { 
        id: 'p2', 
        name: 'Odyssey Website Redesign', 
        description: 'A complete overhaul of the public-facing website with a new design system.', 
        members: ['u1', 'u4'], 
        startDate: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    }
];

export const mockTasks: Task[] = [
    // Tasks for QuantumLeap CRM (p1)
    { id: 't1', title: 'Design Database Schema', description: 'Define all tables, columns, and relationships for the CRM.', status: TaskStatus.Done, priority: TaskPriority.High, assigneeId: 'u2', projectId: 'p1', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), duration: 7 },
    { id: 't2', title: 'Develop Authentication Service', description: 'Implement user login, registration, and session management.', status: TaskStatus.InProgress, priority: TaskPriority.High, assigneeId: 'u2', projectId: 'p1', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), duration: 5 },
    { id: 't3', title: 'Create Dashboard UI Mockups', description: 'Design the main dashboard view in Figma.', status: TaskStatus.InProgress, priority: TaskPriority.Medium, assigneeId: 'u3', projectId: 'p1', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(), duration: 4 },
    { id: 't4', title: 'Setup CI/CD Pipeline', description: 'Configure automated testing and deployment.', status: TaskStatus.ToDo, priority: TaskPriority.Medium, assigneeId: 'u1', projectId: 'p1', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), duration: 3 },
    { id: 't5', title: 'Build Contact Management API', description: 'Develop endpoints for creating, reading, updating, and deleting contacts.', status: TaskStatus.ToDo, priority: TaskPriority.High, assigneeId: 'u2', projectId: 'p1', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), isBlocked: true, duration: 8 },

    // Tasks for Odyssey Website Redesign (p2)
    { id: 't6', title: 'User Research & Personas', description: 'Identify target audience and user needs.', status: TaskStatus.Done, priority: TaskPriority.Medium, assigneeId: 'u4', projectId: 'p2', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 80)).toISOString(), duration: 10 },
    { id: 't7', title: 'Create Wireframes', description: 'Low-fidelity layouts for all key pages.', status: TaskStatus.Done, priority: TaskPriority.High, assigneeId: 'u4', projectId: 'p2', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 70)).toISOString(), duration: 6 },
    { id: 't8', title: 'Finalize Logo & Brand Guide', description: 'Create final branding assets.', status: TaskStatus.Done, priority: TaskPriority.High, assigneeId: 'u1', projectId: 'p2', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(), duration: 5 },
    { id: 't9', title: 'Develop Homepage', description: 'Build the main landing page with responsive design.', status: TaskStatus.Done, priority: TaskPriority.High, assigneeId: 'u4', projectId: 'p2', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(), duration: 15 },
    { id: 't10', title: 'Deploy to Production', description: 'Final launch of the new website.', status: TaskStatus.Done, priority: TaskPriority.High, assigneeId: 'u1', projectId: 'p2', creatorId: 'u1', dueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), duration: 2 },
];

export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        type: 'completion',
        message: 'completed the task "Finalize Logo & Brand Guide"',
        user: { name: 'Alex Morgan', avatarUrl: mockUsers.find(u => u.id === 'u1')?.avatarUrl || '' },
        timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        isRead: false,
    },
    {
        id: 'n2',
        type: 'comment',
        message: 'commented on "Develop Authentication Service"',
        user: { name: 'Casey Smith', avatarUrl: mockUsers.find(u => u.id === 'u3')?.avatarUrl || '' },
        timestamp: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
        isRead: false,
    },
     {
        id: 'n3',
        type: 'assignment',
        message: 'assigned you to "Build Contact Management API"',
        user: { name: 'Alex Morgan', avatarUrl: mockUsers.find(u => u.id === 'u1')?.avatarUrl || '' },
        timestamp: new Date(new Date().setHours(new Date().getHours() - 8)).toISOString(),
        isRead: true,
    },
];

export const mockActivities: Activity[] = [
    {
        id: 'a1',
        type: ActivityType.TaskCreate,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        userId: 'u1',
        projectId: 'p1',
        taskId: 't4',
        details: { taskTitle: 'Setup CI/CD Pipeline' }
    },
    {
        id: 'a2',
        type: ActivityType.TaskUpdateStatus,
        timestamp: new Date(new Date().setHours(new Date().getHours() - 10)).toISOString(),
        userId: 'u3',
        projectId: 'p1',
        taskId: 't3',
        details: { taskTitle: 'Create Dashboard UI Mockups', from: TaskStatus.ToDo, to: TaskStatus.InProgress }
    },
    {
        id: 'a3',
        type: ActivityType.TaskUpdateAssignee,
        timestamp: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
        userId: 'u1',
        projectId: 'p1',
        taskId: 't2',
        details: { taskTitle: 'Develop Authentication Service', from: 'Casey Smith', to: 'Jordan Lee' }
    }
];
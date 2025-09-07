import React, { useState, useMemo } from 'react';
import { Project, Task } from '../types';
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isToday, 
    addMonths, 
    subMonths, 
    getDay,
    isWithinInterval,
    isSameDay
} from 'date-fns';

interface CalendarViewProps {
    projects: Project[];
    tasks: Task[];
}

const CalendarHeader: React.FC<{ currentDate: Date; onPrevMonth: () => void; onNextMonth: () => void; }> = ({ currentDate, onPrevMonth, onNextMonth }) => (
    <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-dark">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex space-x-2">
            <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    </div>
);

const CalendarGrid: React.FC<{ currentDate: Date; events: CalendarEvent[] }> = ({ currentDate, events }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const getEventsForDay = (day: Date) => {
        return events.filter(event => {
            if (event.type === 'task') {
                return isSameDay(new Date(event.date), day);
            }
            if (event.type === 'project') {
                 return isWithinInterval(day, { start: new Date(event.startDate), end: new Date(event.endDate) });
            }
            return false;
        });
    }

    return (
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {weekdays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2 bg-white">{day}</div>
            ))}
            {days.map(day => {
                const dayEvents = getEventsForDay(day);
                return (
                    <div
                        key={day.toString()}
                        className={`min-h-[120px] p-2 bg-white relative ${!isSameMonth(day, monthStart) ? 'bg-gray-50' : ''}`}
                    >
                        <time dateTime={format(day, 'yyyy-MM-dd')} className={`text-sm font-semibold ${isToday(day) ? 'bg-primary text-white rounded-full flex items-center justify-center w-6 h-6' : 'text-gray-800'}`}>
                            {format(day, 'd')}
                        </time>
                        <div className="mt-1 space-y-1">
                            {dayEvents.map(event => (
                                 <div 
                                    key={event.id} 
                                    title={event.title}
                                    className={`px-2 py-1 text-xs rounded text-white truncate ${event.type === 'task' ? 'bg-accent-blue' : 'bg-accent-green'}`}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface CalendarEvent {
    id: string;
    title: string;
    type: 'task' | 'project';
    date: string; // for tasks
    startDate: string; // for projects
    endDate: string; // for projects
}

const CalendarView: React.FC<CalendarViewProps> = ({ projects, tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const calendarEvents = useMemo<CalendarEvent[]>(() => {
        const taskEvents: CalendarEvent[] = tasks.map(task => ({
            id: task.id,
            title: task.title,
            type: 'task',
            date: task.dueDate,
            startDate: '',
            endDate: '',
        }));

        const projectEvents: CalendarEvent[] = projects.map(project => ({
             id: project.id,
             title: project.name,
             type: 'project',
             date: '',
             startDate: project.startDate,
             endDate: project.endDate
        }));

        return [...taskEvents, ...projectEvents];

    }, [projects, tasks]);
    
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-dark">Calendar</h1>
                <p className="text-secondary mt-1">View project timelines and task deadlines at a glance.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-white">
                <CalendarHeader 
                    currentDate={currentDate} 
                    onPrevMonth={handlePrevMonth} 
                    onNextMonth={handleNextMonth} 
                />
                <CalendarGrid currentDate={currentDate} events={calendarEvents} />
            </div>
        </div>
    );
};

export default CalendarView;

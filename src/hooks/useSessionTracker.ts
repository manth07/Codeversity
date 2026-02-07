'use client';

import { useState, useEffect } from 'react';

interface Session {
    id: string;
    startTime: number;
    endTime?: number;
    duration: number; // seconds
    date: string; // YYYY-MM-DD
}

interface DayActivity {
    day: string;
    minutes: number;
}

const STORAGE_KEY = 'astra_sessions';
const ACTIVE_SESSION_KEY = 'astra_active_session';

export function useSessionTracker() {
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [last7Days, setLast7Days] = useState<DayActivity[]>([]);

    useEffect(() => {
        // Start session
        const sessionId = Date.now().toString();
        const startTime = Date.now();
        const date = new Date().toISOString().split('T')[0];

        const activeSession = {
            id: sessionId,
            startTime,
            date,
            duration: 0,
        };

        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));

        // Update duration every 10 seconds
        const interval = setInterval(() => {
            const active = localStorage.getItem(ACTIVE_SESSION_KEY);
            if (active) {
                const session = JSON.parse(active);
                session.duration = Math.floor((Date.now() - session.startTime) / 1000);
                localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));

                // Update UI
                calculateStats();
            }
        }, 10000); // Every 10 seconds

        // Calculate initial stats
        calculateStats();

        // End session on unmount
        return () => {
            clearInterval(interval);
            endSession();
        };
    }, []);

    const endSession = () => {
        const active = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (active) {
            const session = JSON.parse(active);
            session.endTime = Date.now();
            session.duration = Math.floor((session.endTime - session.startTime) / 1000);

            // Save to sessions
            const sessions: Session[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            sessions.push(session);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            localStorage.removeItem(ACTIVE_SESSION_KEY);
        }
    };

    const calculateStats = () => {
        const sessions: Session[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const active = localStorage.getItem(ACTIVE_SESSION_KEY);

        // Add active session duration
        const allSessions = [...sessions];
        if (active) {
            const activeSession = JSON.parse(active);
            activeSession.duration = Math.floor((Date.now() - activeSession.startTime) / 1000);
            allSessions.push(activeSession);
        }

        // Calculate total minutes
        const total = allSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
        setTotalMinutes(Math.round(total));

        // Calculate last 7 days
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const activities: DayActivity[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = dayNames[date.getDay()];

            const dayMinutes = allSessions
                .filter(s => s.date === dateStr)
                .reduce((sum, s) => sum + s.duration, 0) / 60;

            activities.push({
                day: dayName,
                minutes: Math.round(dayMinutes),
            });
        }

        setLast7Days(activities);
    };

    return { totalMinutes, last7Days };
}

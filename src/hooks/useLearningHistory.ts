'use client';

import { useState, useEffect } from 'react';

export interface LearningTopic {
    id: string;
    topic: string;
    timestamp: number;
    language: string;
    difficulty: string;
}

const HISTORY_KEY = 'astra_learning_history';
const MAX_HISTORY = 20;

export function useLearningHistory() {
    const [history, setHistory] = useState<LearningTopic[]>([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            const parsed: LearningTopic[] = JSON.parse(stored);
            setHistory(parsed.slice(0, MAX_HISTORY));
        }
    };

    const addTopic = (topic: string, language: string, difficulty: string) => {
        const newTopic: LearningTopic = {
            id: Date.now().toString(),
            topic,
            timestamp: Date.now(),
            language,
            difficulty,
        };

        const stored = localStorage.getItem(HISTORY_KEY);
        const existing: LearningTopic[] = stored ? JSON.parse(stored) : [];

        // Add to beginning, limit to MAX_HISTORY
        const updated = [newTopic, ...existing].slice(0, MAX_HISTORY);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        setHistory(updated);
    };

    const clearHistory = () => {
        localStorage.removeItem(HISTORY_KEY);
        setHistory([]);
    };

    return { history, addTopic, clearHistory };
}

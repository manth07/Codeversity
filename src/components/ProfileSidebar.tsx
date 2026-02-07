'use client';

import { useSessionTracker } from '@/hooks/useSessionTracker';
import { useLearningHistory, LearningTopic } from '@/hooks/useLearningHistory';
import { EnhancedCard3D } from './EnhancedCard3D';
import { Clock, History, TrendingUp } from 'lucide-react';

interface ProfileSidebarProps {
    onTopicSelect?: (topic: LearningTopic) => void;
}

export function ProfileSidebar({ onTopicSelect }: ProfileSidebarProps) {
    const { totalMinutes, last7Days } = useSessionTracker();
    const { history } = useLearningHistory();

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1);

    return (
        <aside className="w-80 bg-white/40 backdrop-blur-xl p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Profile */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">A</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Astra Learner</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(totalMinutes)} learning time</span>
                </div>
            </div>

            {/* Activity Summary */}
            <EnhancedCard3D className="bg-white/60 p-4" hoverEffect={false}>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-900">This Week</h3>
                </div>

                {/* Day-by-day list */}
                <div className="space-y-2">
                    {last7Days.map((data, idx) => {
                        const isToday = idx === last7Days.length - 1;
                        return (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-2 rounded-lg ${isToday ? 'bg-purple-100' : 'bg-gray-50'
                                    }`}
                            >
                                <span className={`text-sm font-medium ${isToday ? 'text-purple-900' : 'text-gray-700'
                                    }`}>
                                    {data.day}
                                    {isToday && <span className="ml-2 text-xs">(Today)</span>}
                                </span>
                                <span className={`text-sm font-bold ${isToday ? 'text-purple-600' : 'text-gray-600'
                                    }`}>
                                    {data.minutes}m
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 text-center">
                    <span className="text-2xl font-bold text-gray-900">{formatTime(totalMinutes)}</span>
                    <p className="text-xs text-gray-500 mt-1">Total learning time</p>
                </div>
            </EnhancedCard3D>

            {/* Learning History */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Recent Topics</h3>
                </div>

                {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No learning history yet</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onTopicSelect?.(item)}
                                className="w-full text-left p-3 rounded-xl bg-white/60 hover:bg-white hover:shadow-md transition-all group"
                            >
                                <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600">
                                    {item.topic}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">{item.language}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <EnhancedCard3D className="bg-gradient-to-br from-purple-100 to-pink-100 p-4" hoverEffect={false}>
                <p className="text-sm text-gray-700 leading-relaxed">
                    💡 <strong>Tip:</strong> All your learning data is stored locally for privacy. No data leaves your device.
                </p>
            </EnhancedCard3D>
        </aside>
    );
}

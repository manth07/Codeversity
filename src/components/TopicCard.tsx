'use client';

import { EnhancedCard3D } from './EnhancedCard3D';
import { BookOpen, Users, Star } from 'lucide-react';

interface TopicCardProps {
    title: string;
    category: string;
    students: string;
    rating: string;
    color: 'pink' | 'peach' | 'lavender' | 'mint';
    onClick?: () => void;
}

const colorClasses = {
    pink: 'bg-[rgba(255,212,212,0.4)]',
    peach: 'bg-[rgba(255,229,204,0.4)]',
    lavender: 'bg-[rgba(224,212,255,0.4)]',
    mint: 'bg-[rgba(212,255,224,0.4)]',
};

const categoryIcons: Record<string, any> = {
    'IT & Software': BookOpen,
    'Business': Users,
    'Media Training': Star,
    'Interior': BookOpen,
};

export function TopicCard({ title, category, students, rating, color, onClick }: TopicCardProps) {
    const Icon = categoryIcons[category] || BookOpen;

    return (
        <EnhancedCard3D className={`${colorClasses[color]} p-6`} hoverEffect>
            <div className="flex flex-col h-full" onClick={onClick}>
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                        <Icon className="w-4 h-4 text-gray-700" />
                        <span className="text-xs font-medium text-gray-800">{category}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-800">{rating}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2 flex-1">
                    {title}
                </h3>

                {/* Students */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{students} students</span>
                </div>
            </div>
        </EnhancedCard3D>
    );
}

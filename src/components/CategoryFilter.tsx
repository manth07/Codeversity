'use client';

import { BookOpen, Monitor, Video, Briefcase, Home } from 'lucide-react';

const categories = [
    { id: 'all', label: 'All', icon: BookOpen },
    { id: 'it', label: 'IT & Software', icon: Monitor },
    { id: 'media', label: 'Media Training', icon: Video },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'interior', label: 'Interior', icon: Home },
];

interface CategoryFilterProps {
    activeCategory?: string;
    onCategoryChange?: (category: string) => void;
}

export function CategoryFilter({ activeCategory = 'all', onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange?.(category.id)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-full transition-all whitespace-nowrap
              ${isActive
                                ? 'bg-black text-white shadow-lg'
                                : 'bg-white/60 text-gray-700 hover:bg-white hover:shadow-md'
                            }
            `}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

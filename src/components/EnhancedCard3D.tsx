'use client';

import { ReactNode } from 'react';

interface EnhancedCard3DProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function EnhancedCard3D({ children, className = '', hoverEffect = true }: EnhancedCard3DProps) {
    return (
        <div
            className={`
        card-shadow rounded-3xl transition-all duration-300
        ${hoverEffect ? 'hover:card-shadow-hover hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
            style={{
                transform: hoverEffect ? 'perspective(1000px)' : undefined,
            }}
        >
            {children}
        </div>
    );
}

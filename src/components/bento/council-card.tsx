'use client';

import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface CouncilCardProps {
    confidence: number; // 0.0 to 1.0
    verifierName: string;
    verdict: 'APPROVED' | 'REVISED' | 'FLAGGED';
    notes?: string;
    className?: string;
}

export const CouncilCard = ({ confidence, verifierName, verdict, notes, className }: CouncilCardProps) => {
    const isVerified = verdict === 'APPROVED' && confidence > 0.8;
    const isFlagged = verdict === 'FLAGGED';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'relative overflow-hidden rounded-xl border p-4 backdrop-blur-md transition-colors',
                isVerified
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isFlagged
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-amber-500/30 bg-amber-500/5',
                className
            )}
        >
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {isVerified ? (
                        <BadgeCheck className="h-5 w-5 text-emerald-400" />
                    ) : isFlagged ? (
                        <ShieldAlert className="h-5 w-5 text-red-400" />
                    ) : (
                        <ShieldCheck className="h-5 w-5 text-amber-400" />
                    )}
                    <span className="text-sm font-semibold tracking-wider text-zinc-200">
                        COUNCIL AUDIT
                    </span>
                </div>
                <div
                    className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                        isVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    )}
                >
                    {Math.round(confidence * 100)}%
                </div>
            </div>

            <div className="space-y-2">
                <div>
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                        Verified By
                    </p>
                    <p className="font-mono text-sm text-zinc-100">{verifierName}</p>
                </div>
                {notes && (
                    <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-zinc-400 italic">"{notes}"</p>
                    </div>
                )}
            </div>

            {/* Decorative Glow */}
            <div
                className={cn(
                    'absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl opacity-20',
                    isVerified ? 'bg-emerald-500' : 'bg-amber-500'
                )}
            />
        </motion.div>
    );
};

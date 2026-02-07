'use client';

import { EnhancedCard3D } from '@/components/EnhancedCard3D';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "Alex R.",
        role: "Physics Student",
        text: "I finally understood Quantum Entanglement thanks to the visual diagrams. The offline mode is a lifesaver for my commute.",
        avatar: "👨‍🎓",
        topic: "Quantum Physics"
    },
    {
        name: "Sarah M.",
        role: "Lifelong Learner",
        text: "The dual-agent system is brilliant. It feels like having a professor and a strict TA checking everything in real-time.",
        avatar: "👩‍💻",
        topic: "Machine Learning"
    },
    {
        name: "Raj P.",
        role: "History Buff",
        text: "Being able to ask questions in Hindi and get accurate, sourced answers is incredible. Astra Learn is my go-to now.",
        avatar: "🌍",
        topic: "Ancient History"
    }
];

export function Testimonials() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
                <EnhancedCard3D key={idx} className="bg-white/[0.05] backdrop-blur-sm border border-white/10 p-6 flex flex-col h-full hover:bg-white/[0.1] transition-colors">
                    <div className="flex items-center gap-1 mb-4 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>

                    <p className="text-gray-300 italic mb-6 text-sm leading-relaxed flex-grow">"{t.text}"</p>

                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                            {t.avatar}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-white">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.role}</div>
                        </div>
                    </div>

                    <div className="mt-4 inline-flex self-start px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs rounded-md font-medium">
                        Learned {t.topic}
                    </div>
                </EnhancedCard3D>
            ))}
        </div>
    );
}

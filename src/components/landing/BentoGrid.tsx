'use client';

import {
    Cpu,
    Globe,
    Lock,
    Mic,
    Zap,
    Brain,
    Share2,
    Download
} from 'lucide-react';
import { EnhancedCard3D } from '@/components/EnhancedCard3D';

export function BentoGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-4 gap-4 h-full min-h-[800px]">
            {/* Feature 1: Offline (Large) */}
            <EnhancedCard3D className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-900/50 to-black/50 border border-white/10 p-8 flex flex-col justify-between group overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
                <div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">100% Offline Privacy</h3>
                    <p className="text-gray-400 text-lg">
                        Your learning data never leaves your device. All AI processing happens locally using Ollama.
                        No tracking, no clouds, just you.
                    </p>
                </div>
                <div className="mt-8 bg-black/30 rounded-lg p-4 font-mono text-sm text-green-400 border border-white/10">
                    &gt; init_local_server()<br />
                    &gt; load_model("deepseek-r1")...<br />
                    &gt; status: ONLINE (LOCAL)
                </div>
            </EnhancedCard3D>

            {/* Feature 2: Multi-Agent */}
            <EnhancedCard3D className="md:col-span-2 md:row-span-1 bg-black/40 backdrop-blur-lg border border-white/10 p-6 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">Dual Agents</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Tutor + Council</h3>
                    <p className="text-gray-400">One teaches, one verifies.</p>
                </div>
                <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center">🤖</div>
                    <div className="w-12 h-12 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center">🦉</div>
                </div>
            </EnhancedCard3D>

            {/* Feature 3: Multilingual */}
            <EnhancedCard3D className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-pink-900/20 to-black/40 border border-white/10 p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <Globe className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">10+ Languages</h3>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['🇪🇸', 'fr', 'hi', 'cn', 'ar', 'jp'].map(lang => (
                        <span key={lang} className="px-2 py-1 bg-white/10 border border-white/10 rounded-md text-xs text-gray-200">{lang}</span>
                    ))}
                </div>
            </EnhancedCard3D>

            {/* Feature 4: Audio */}
            <EnhancedCard3D className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-blue-900/20 to-black/40 border border-white/10 p-6 flex flex-col justify-end group">
                <div className="mb-auto w-12 h-12 rounded-xl bg-blue-500/80 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Neural Voice</h3>
                <p className="text-sm text-gray-400">Listen to lessons on the go with natural-sounding AI narration.</p>
                <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 animate-pulse" />
                </div>
            </EnhancedCard3D>

            {/* Feature 5: Diagrams */}
            <EnhancedCard3D className="md:col-span-2 md:row-span-1 bg-black/40 backdrop-blur-lg border border-white/10 p-6 flex items-center gap-6 overflow-hidden">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Visual Learning</h3>
                    <p className="text-sm text-gray-400">Complex topics turned into clear Mermaid.js diagrams automatically.</p>
                </div>
                <div className="w-32 h-24 bg-gray-50 rounded-lg border border-gray-200 p-2 flex flex-col gap-2 opacity-70 rotate-3">
                    <div className="w-full h-1/2 bg-purple-100 rounded" />
                    <div className="flex gap-2 h-1/2">
                        <div className="w-1/2 bg-blue-100 rounded" />
                        <div className="w-1/2 bg-green-100 rounded" />
                    </div>
                </div>
            </EnhancedCard3D>
        </div>
    );
}

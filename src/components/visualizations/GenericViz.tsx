'use client';

interface GenericVizProps {
    topic: string;
}

export default function GenericViz({ topic }: GenericVizProps) {
    return (
        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden flex items-center justify-center">
            {/* Animated grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#grid)" />
            </svg>

            {/* Pulsing orbs */}
            <div className="absolute inset-0">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="absolute w-32 h-32 rounded-full bg-purple-500/20 blur-xl animate-pulse"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                            animationDelay: `${i * 0.4}s`,
                            animationDuration: '4s'
                        }}
                    />
                ))}
            </div>

            {/* Central content */}
            <div className="relative z-10 text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500/50 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse"></div>
                </div>

                <h3 className="text-2xl font-serif text-white">{topic}</h3>
                <p className="text-sm text-slate-400 font-mono">CONCEPTUAL VISUALIZATION</p>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/30">
                <p className="text-xs font-mono text-purple-400">ABSTRACT REPRESENTATION</p>
            </div>
        </div>
    );
}

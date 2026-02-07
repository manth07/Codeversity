'use client';

export default function PhotosynthesisViz() {
    return (
        <div className="relative w-full h-full bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 overflow-hidden">
            <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Chloroplast outer membrane */}
                <ellipse cx="200" cy="200" rx="180" ry="160" fill="url(#chloroplastGradient)" stroke="#10b981" strokeWidth="2" opacity="0.8" />

                {/* Thylakoid stacks (grana) */}
                {[0, 1, 2, 3].map((i) => (
                    <g key={i}>
                        <ellipse
                            cx={120 + i * 60}
                            cy={180 + (i % 2) * 40}
                            rx="25"
                            ry="35"
                            fill="url(#thylakoidGradient)"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s`, animationDuration: '3s' }}
                        />
                    </g>
                ))}

                {/* Light rays coming in */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <line
                        key={`light-${i}`}
                        x1={50 + i * 20}
                        y1="20"
                        x2={80 + i * 25}
                        y2="100"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        opacity="0.6"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s`, animationDuration: '2s' }}
                    />
                ))}

                {/* Oxygen bubbles rising */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <circle
                        key={`o2-${i}`}
                        cx={180 + (i % 3) * 40}
                        cy={300 - (i * 30)}
                        r="6"
                        fill="#22d3ee"
                        opacity="0.7"
                        className="animate-ping"
                        style={{
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '4s',
                            animationIterationCount: 'infinite'
                        }}
                    />
                ))}

                {/* ATP molecules (glowing dots) */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                    const angle = (i / 9) * Math.PI * 2;
                    const radius = 140;
                    return (
                        <circle
                            key={`atp-${i}`}
                            cx={200 + Math.cos(angle) * radius}
                            cy={200 + Math.sin(angle) * radius * 0.8}
                            r="4"
                            fill="#f59e0b"
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1.5s' }}
                        >
                            <animate
                                attributeName="r"
                                values="4;6;4"
                                dur="2s"
                                repeatCount="indefinite"
                                begin={`${i * 0.2}s`}
                            />
                        </circle>
                    );
                })}

                {/* Gradients */}
                <defs>
                    <radialGradient id="chloroplastGradient">
                        <stop offset="0%" stopColor="#065f46" />
                        <stop offset="100%" stopColor="#047857" />
                    </radialGradient>
                    <linearGradient id="thylakoidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Labels */}
            <div className="absolute top-4 left-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-yellow-200 font-mono">LIGHT ENERGY</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                    <span className="text-cyan-200 font-mono">O₂ OUTPUT</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-orange-200 font-mono">ATP ENERGY</span>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/30">
                <p className="text-xs font-mono text-emerald-400">CHLOROPLAST ACTIVITY</p>
            </div>
        </div>
    );
}

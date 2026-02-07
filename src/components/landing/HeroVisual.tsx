'use client';

import { motion } from 'framer-motion';
import MermaidRenderer from '@/components/visualizations/MermaidRenderer';

export function HeroVisual() {
    // Clean flowchart matching the user's design
    const mermaidDiagram = `
flowchart TD
    A[Start Topic] --> B{AI Agent 1}
    B -->|Drafts Content| C[Tutor Mode]
    C --> D{AI Agent 2}
    D -->|Verifies Facts| E[Council Audit]
    E --> F[Approved Lesson]
    C -.->|Issues Found| D
    
    style A fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    style B fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    style C fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    style D fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    style E fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    style F fill:#374151,stroke:#9ca3af,stroke-width:2px,color:#e5e7eb
    
    linkStyle default stroke:#10b981,stroke-width:2px
    `;

    return (
        <div className="relative h-full w-full flex items-center justify-center">
            {/* Subtle floating background elements */}
            <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-purple-500/5"
                animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-pink-500/5"
                animate={{
                    y: [0, 20, 0],
                    x: [0, -15, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Clean diagram card - no blur */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
                whileHover={{ scale: 1.02 }}
            >
                <div className="bg-[#2d3748] rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10">
                    {/* Title */}
                    <div className="mb-4 text-center">
                        <h3 className="text-white font-bold text-lg mb-1">Dual-Agent Architecture</h3>
                        <p className="text-gray-400 text-xs">Every lesson is verified twice</p>
                    </div>

                    {/* Mermaid diagram - crisp and clear */}
                    <div className="bg-[#1f2937] rounded-lg p-6 border border-white/5">
                        <MermaidRenderer diagram={mermaidDiagram} topic="Dual Agent Flow" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">2</div>
                            <div className="text-xs text-gray-400">AI Agents</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">100%</div>
                            <div className="text-xs text-gray-400">Verified</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                ⚡ 100% Local
            </motion.div>
        </div>
    );
}

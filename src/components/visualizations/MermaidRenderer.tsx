'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
    diagram: string;
    topic: string;
}

export default function MermaidRenderer({ diagram, topic }: MermaidRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!containerRef.current || !diagram) return;

        // Initialize Mermaid with custom dark theme matching our aesthetic
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            themeVariables: {
                primaryColor: '#10b981',
                primaryTextColor: '#f0f9ff',
                primaryBorderColor: '#34d399',
                lineColor: '#6ee7b7',
                secondaryColor: '#3b82f6',
                tertiaryColor: '#8b5cf6',
                background: '#0a0f1c',
                mainBkg: '#1e293b',
                secondBkg: '#334155',
                fontSize: '14px',
                fontFamily: 'ui-monospace, monospace',
            },
        });

        // Render the diagram
        const renderDiagram = async () => {
            try {
                setError(null);
                const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), diagram);

                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;

                    // Fix SVG sizing to show full content
                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.classList.add('animate-in', 'fade-in', 'duration-700');

                        // Make SVG responsive and fit container
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.maxHeight = '100%';

                        // Preserve aspect ratio and ensure full diagram is visible
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

                        // Get viewBox to ensure full content fits
                        const viewBox = svgElement.getAttribute('viewBox');
                        if (viewBox) {
                            const [x, y, width, height] = viewBox.split(' ').map(Number);
                            // Add padding to viewBox to prevent clipping
                            const padding = 20;
                            svgElement.setAttribute('viewBox', `${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}`);
                        }
                    }
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Diagram syntax error - using fallback visualization');

                // Show fallback message
                if (containerRef.current) {
                    containerRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-8">
              <div class="w-20 h-20 mb-4 rounded-full border-4 border-purple-500/50 flex items-center justify-center animate-pulse">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
              </div>
              <p class="text-red-400 text-sm mb-2">Unable to generate diagram</p>
              <p class="text-slate-400 text-xs">The AI generated invalid syntax. Please try another topic.</p>
            </div>
          `;
                }
            }
        };

        renderDiagram();
    }, [diagram]);

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
    };

    return (
        <div
            className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden"
            role="img"
            aria-label={`Interactive diagram explaining ${topic}`}
        >
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button
                    onClick={() => handleZoom(-0.1)}
                    className="w-8 h-8 bg-black/50 backdrop-blur-md border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    title="Zoom Out"
                    aria-label="Zoom out diagram"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <button
                    onClick={() => handleZoom(0.1)}
                    className="w-8 h-8 bg-black/50 backdrop-blur-md border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    title="Zoom In"
                    aria-label="Zoom in diagram"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <button
                    onClick={() => setZoom(1)}
                    className="px-3 h-8 bg-black/50 backdrop-blur-md border border-emerald-500/30 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors font-mono"
                    title="Reset Zoom"
                    aria-label={`Reset zoom to 100%, currently at ${Math.round(zoom * 100)}%`}
                >
                    {Math.round(zoom * 100)}%
                </button>
            </div>

            {/* Diagram Container with Zoom */}
            <div
                className="w-full h-full flex items-center justify-center p-8 overflow-auto"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
            >
                <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
            </div>

            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/30">
                <p className="text-xs font-mono text-emerald-400">
                    {error ? '⚠️ FALLBACK MODE' : '🤖 AI-GENERATED DIAGRAM'}
                </p>
            </div>

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                <p className="text-xs font-mono text-white uppercase tracking-wider">{topic}</p>
            </div>
        </div>
    );
}

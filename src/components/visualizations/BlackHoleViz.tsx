'use client';

import { useEffect, useRef } from 'react';

export default function BlackHoleViz() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Animation state
        let frame = 0;
        const particles: Array<{
            angle: number;
            radius: number;
            speed: number;
            color: string;
            size: number;
        }> = [];

        // Create particles for accretion disk
        for (let i = 0; i < 150; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: 120 + Math.random() * 180,
                speed: 0.002 + Math.random() * 0.003,
                color: `hsl(${180 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`,
                size: 1 + Math.random() * 3
            });
        }

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear with fade effect
            ctx.fillStyle = 'rgba(10, 15, 28, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Draw event horizon (black hole center)
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.8, '#0a0a1a');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
            ctx.fill();

            // Glowing ring around horizon
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
            ctx.stroke();

            // Animate particles in accretion disk
            particles.forEach(p => {
                // Spiral inward
                p.radius -= p.speed * 10;
                p.angle += p.speed * (300 / p.radius); // Faster as closer to center

                // Reset if too close
                if (p.radius < 90) {
                    p.radius = 120 + Math.random() * 180;
                    p.angle = Math.random() * Math.PI * 2;
                }

                const x = centerX + Math.cos(p.angle) * p.radius;
                const y = centerY + Math.sin(p.angle) * p.radius * 0.3; // Flatten for disk effect

                // Glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Gravitational lensing effect (curved lines)
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 8; i++) {
                const angle = (frame * 0.001 + i * Math.PI / 4);
                ctx.beginPath();
                ctx.arc(centerX, centerY, 150 + i * 20, angle, angle + Math.PI * 0.8);
                ctx.stroke();
            }

            frame++;
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-emerald-500/30">
                <p className="text-xs font-mono text-emerald-400">ACCRETION DISK SIMULATION</p>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useRef } from 'react';

export default function Background3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Static particles system (no mouse interaction)
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
            color: string;
            type: 'star' | 'dust';
        }> = [];

        // Initialize static particles
        for (let i = 0; i < 20; i++) {
            const type = Math.random() > 0.7 ? 'star' : 'dust';
            const colors = {
                star: ['#ffffff', '#f0f8ff'],
                dust: ['rgba(255, 255, 255, 0.4)']
            };

            const vx = (Math.random() - 0.5) * 0.05; // Very slow movement
            const vy = (Math.random() - 0.5) * 0.05;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            particles.push({
                x,
                y,
                vx,
                vy,
                size: type === 'star' ? Math.random() * 1.5 + 0.5 : Math.random() * 0.8 + 0.3,
                opacity: Math.random() * 0.4 + 0.1,
                color: colors[type][Math.floor(Math.random() * colors[type].length)],
                type
            });
        }

        // Simple animation loop without mouse interaction
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <>
            {/* Beautiful Galaxy Background */}
            <div className="galaxy-background"></div>

            {/* Nebula Clouds */}
            <div className="nebula"></div>
            <div className="nebula"></div>

            {/* Stars */}
            <div className="stars">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="star"></div>
                ))}
            </div>

            {/* Shooting Star */}
            <div className="shooting-star"></div>

            {/* Cosmic Dust */}
            <div className="cosmic-dust"></div>
            <div className="cosmic-dust"></div>
            <div className="cosmic-dust"></div>

            {/* Static Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: -1 }}
            />

            {/* Floating elements */}
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-1/3 w-1 h-1 bg-pink-400 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-yellow-400 rounded-full opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
        </>
    );
}

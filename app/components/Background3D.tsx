'use client';

import { useEffect, useState } from 'react';

function randomBetween(a: number, b: number) {
    return a + Math.random() * (b - a);
}

export default function Background3D() {
    // Tạo nhiều ripple động random vị trí
    const [ripples, setRipples] = useState(() =>
        Array.from({ length: 6 }, (_, i) => ({
            id: i,
            top: `${randomBetween(10, 80)}%`,
            left: `${randomBetween(5, 90)}%`,
            delay: `${randomBetween(0, 6)}s`,
            size: randomBetween(120, 320),
            color: i % 2 === 0 ? 'rgba(56,189,248,0.13)' : 'rgba(99,102,241,0.10)'
        }))
    );

    // Định kỳ random lại vị trí ripple để tạo cảm giác động tự nhiên
    useEffect(() => {
        const interval = setInterval(() => {
            setRipples(ripples => ripples.map(r => ({
                ...r,
                top: `${randomBetween(10, 80)}%`,
                left: `${randomBetween(5, 90)}%`,
                size: randomBetween(120, 320),
                delay: `${randomBetween(0, 6)}s`,
            })));
        }, 9000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
            {/* Galaxy gradient background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: -2,
                background: 'radial-gradient(ellipse at 60% 40%, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #0a0a0a 100%)',
                animation: 'galaxyPulse 30s ease-in-out infinite',
                willChange: 'background-position',
            }} />
            {/* 1 nebula lớn chuyển động nhẹ */}
            <div style={{
                position: 'absolute',
                top: '20%', left: '20%', width: 320, height: 320,
                background: 'radial-gradient(circle, #ff6b9d, #c44569, transparent)',
                borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15,
                animation: 'nebulaFloatX 40s ease-in-out infinite',
                animationDelay: '0s',
                transform: 'scale3d(1.1,1.1,1.1)',
            }} />
            {/* Water ripple effect */}
            {ripples.map(r => (
                <div key={r.id} style={{
                    position: 'absolute',
                    top: r.top,
                    left: r.left,
                    width: r.size,
                    height: r.size,
                    background: `radial-gradient(circle, ${r.color} 60%, transparent 100%)`,
                    borderRadius: '50%',
                    opacity: 0.7,
                    animation: 'rippleAnim 6s linear infinite',
                    animationDelay: r.delay,
                    pointerEvents: 'none',
                    zIndex: -1,
                }} />
            ))}
            {/* Keyframes */}
            <style>{`
        @keyframes galaxyPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes nebulaFloatX {
          0%, 100% { transform: translateX(0px) scale3d(1.1,1.1,1.1); opacity: 0.15; }
          50% { transform: translateX(40px) scale3d(1.18,1.1,1.15); opacity: 0.19; }
        }
        @keyframes rippleAnim {
          0% { transform: scale(0.8); opacity: 0.7; }
          60% { opacity: 0.5; }
          100% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';

export default function InteractiveEffects() {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let lastMouseMove = 0;
        const throttleDelay = 100; // Gentle throttling

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseMove < throttleDelay) return;

            lastMouseMove = now;
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => {
            setIsHovering(true);
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            {/* Gentle Custom Cursor */}
            <div
                className={`custom-cursor ${isHovering ? 'hover' : ''}`}
                style={{
                    left: cursorPosition.x - 10,
                    top: cursorPosition.y - 10,
                }}
            />

            {/* Single gentle energy wave */}
            <div className="energy-wave" style={{ animationDelay: '0s' }}></div>
        </>
    );
}

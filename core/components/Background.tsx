"use client";

import React from "react";

// OPTIMIZATION: Memoized background to prevent unnecessary re-renders
export const Background = React.memo(function Background() {
    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]"
            style={{
                // GPU acceleration hint
                transform: 'translateZ(0)',
                contain: 'strict',
            }}
        >
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[#030712]" />

            {/* Static Mesh Gradient - No animation for performance */}
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.10) 0%, transparent 50%),
                        radial-gradient(ellipse at 40% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 40%)
                    `,
                }}
            />

            {/* Primary Glowing Orb - GPU optimized */}
            <div
                className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
                style={{
                    top: '5%',
                    left: '10%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    transform: 'translateZ(0)',
                }}
            />

            {/* Secondary Orb - Purple */}
            <div
                className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
                style={{
                    bottom: '10%',
                    right: '5%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    transform: 'translateZ(0)',
                }}
            />

            {/* Grid Pattern Overlay - Simplified */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Radial Vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 7, 18, 0.5) 100%)',
                }}
            />

            {/* Top Gradient Fade */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#030712] to-transparent" />

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />
        </div>
    );
});


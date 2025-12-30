"use client";

import React from "react";

export function Background() {
    const gridPattern = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(99 102 241 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
            {/* Grid Pattern Layer */}
            <div
                className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] opacity-45"
                style={{ backgroundImage: gridPattern }}
            />

            {/* Glowing Intelligence Orb - Primary */}
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen dark:mix-blend-normal" />

            {/* Secondary Orb */}
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-float mix-blend-screen dark:mix-blend-normal" />

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
        </div>
    );
}

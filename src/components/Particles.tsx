'use client';

import { useEffect, useState } from 'react';

export default function Particles() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    // Reduce particle count on mobile — 40 animated divs is too heavy for low-end Android
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip entirely on reduced motion or very small screens
    if (isReducedMotion) return;

    const count = isMobile ? 15 : 40;

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 10}s`,
      // Slower on mobile to reduce repaints
      duration: `${Math.random() * 15 + (isMobile ? 30 : 20)}s`,
      size: `${Math.random() * 2 + 1}px`,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white opacity-[0.07] animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

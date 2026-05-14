'use client';

import { useState, useEffect } from 'react';

const PALETTE = [
  { fill: '#E85451', glow: 'rgba(232,84,81,0.7)' },
  { fill: '#FEF339', glow: 'rgba(254,243,57,0.7)' },
  { fill: '#69BE83', glow: 'rgba(105,190,131,0.7)' },
];

type Dot = {
  id: number;
  x: number;
  y: number;
  fill: string;
  glow: string;
  size: number;
  duration: number;
  delay: number;
  maxOpacity: number;
};

export default function TrafficBg() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    setDots(
      Array.from({ length: 30 }, (_, i) => {
        const c = PALETTE[Math.floor(Math.random() * 3)];
        return {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          fill: c.fill,
          glow: c.glow,
          size: 3 + Math.random() * 5,
          duration: 2 + Math.random() * 6,
          delay: Math.random() * 12,
          maxOpacity: 0.15 + Math.random() * 0.2,
        };
      }),
    );
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {dots.map((dot) => (
        <span
          key={dot.id}
          style={{
            position: 'absolute',
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: dot.fill,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.size * 1.5}px ${dot.glow}`,
            animation: `blink-dot ${dot.duration}s ease-in-out ${dot.delay}s infinite`,
            opacity: 0,
            '--dot-max-opacity': dot.maxOpacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

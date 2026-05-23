'use client';

const PALETTE = [
  { fill: '#E73A36', glow: 'rgba(232,84,81,0.7)' },
  { fill: '#FFED00', glow: 'rgba(254,243,57,0.7)' },
  { fill: '#50B62A', glow: 'rgba(105,190,131,0.7)' },
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

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function buildDots(count: number): Dot[] {
  return Array.from({ length: count }, (_, index) => {
    const colorIndex = Math.floor(pseudoRandom(index + 1) * PALETTE.length);
    const color = PALETTE[colorIndex];

    return {
      id: index,
      x: pseudoRandom(index + 11) * 100,
      y: pseudoRandom(index + 21) * 100,
      fill: color.fill,
      glow: color.glow,
      size: 3 + pseudoRandom(index + 31) * 5,
      duration: 2 + pseudoRandom(index + 41) * 6,
      delay: pseudoRandom(index + 51) * 12,
      maxOpacity: 0.15 + pseudoRandom(index + 61) * 0.2,
    };
  });
}

const DOTS = buildDots(30);

export default function TrafficBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {DOTS.map((dot) => (
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

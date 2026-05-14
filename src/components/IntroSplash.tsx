'use client';

import { useEffect, useState } from 'react';

const LIGHTS = [
  { color: '#E85451', glow: 'rgba(232,84,81,0.75)',   delay: '0s'    },
  { color: '#FEF339', glow: 'rgba(254,243,57,0.75)',   delay: '0.5s'  },
  { color: '#69BE83', glow: 'rgba(105,190,131,0.75)',  delay: '1.0s'  },
];

export default function IntroSplash() {
  const [show,    setShow]    = useState(false);
  const [popped,  setPopped]  = useState(false);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('intro-shown')) return;

    setShow(true);
    const t1 = setTimeout(() => setPopped(true),  80);
    const t2 = setTimeout(() => setSliding(true), 2900);
    const t3 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('intro-shown', '1');
    }, 3900);

    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-10${sliding ? ' intro-slide-up' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.70)' }}
    >
      {/* Traffic light */}
      <div className={popped ? 'intro-pop' : 'opacity-0'}>
        <div
          className="flex flex-col items-center gap-5 px-9 py-7 rounded-[2.5rem]"
          style={{ backgroundColor: '#111', border: '3px solid #2a2a2a', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
        >
          {LIGHTS.map(({ color, glow, delay }) => (
            <div
              key={color}
              className="intro-light-pulse rounded-full"
              style={{
                width: 80,
                height: 80,
                backgroundColor: color,
                animationDelay: delay,
                '--light-glow': glow,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className={`text-center px-6 ${popped ? 'intro-text-pop' : 'opacity-0'}`}>
        <h2
          className="text-6xl sm:text-7xl md:text-8xl leading-tight text-white"
          style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900 }}
        >
          우리동네<br />진보정치
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-300 tracking-wide">
          신호등연대 2026 지방선거 플랫폼
        </p>
      </div>
    </div>
  );
}

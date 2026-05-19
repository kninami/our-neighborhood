'use client';

import { useEffect, useState } from 'react';

const LIGHTS = [
  { color: '#E85451', glow: 'rgba(232,84,81,0.75)', delay: '0s' },
  { color: '#FEF339', glow: 'rgba(254,243,57,0.75)', delay: '0.5s' },
  { color: '#69BE83', glow: 'rgba(105,190,131,0.75)', delay: '1.0s' },
];

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const [popped, setPopped] = useState(false);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    let frame = 0;
    let t1 = 0;
    let t2 = 0;
    let t3 = 0;

    frame = requestAnimationFrame(() => {
      if (sessionStorage.getItem('intro-shown')) {
        return;
      }

      setShow(true);
      t1 = window.setTimeout(() => setPopped(true), 80);
      t2 = window.setTimeout(() => setSliding(true), 2900);
      t3 = window.setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('intro-shown', '1');
      }, 3900);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[200] overflow-hidden ${sliding ? ' intro-slide-up' : ''}`}
      style={{ backgroundColor: '#050608' }}
    >
      <div className="intro-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.06),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.02))]" />

      <div
        className="absolute -left-20 top-16 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(232,84,81,0.28)' }}
      />
      <div
        className="absolute right-[-4rem] top-[12%] h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(254,243,57,0.18)' }}
      />
      <div
        className="absolute bottom-[-5rem] left-[40%] h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(105,190,131,0.18)' }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[16%] h-px w-[32%] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute right-[9%] top-[24%] h-px w-[18%] bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        <div className="absolute left-[10%] bottom-[18%] h-px w-[26%] bg-gradient-to-r from-transparent via-white/16 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/6 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-14 sm:px-10">
        <div className={`grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center ${popped ? 'intro-frame-in' : 'opacity-0'}`}>
          <div className="order-2 lg:order-1">
            <div className={`${popped ? 'intro-copy-rise intro-delay-1' : 'opacity-0'} inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 backdrop-blur-sm`}>
              <div className="flex items-center gap-1.5">
                {LIGHTS.map(({ color }) => (
                  <span
                    key={color}
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-slate-200">
                2026 Local Election Platform
              </span>
            </div>

            <div className={`${popped ? 'intro-copy-rise intro-delay-2' : 'opacity-0'} mt-7`}>
              <p
                className="text-sm uppercase tracking-[0.34em] text-slate-400"
                style={{ fontFamily: 'var(--font-bagel)' }}
              >
                three lights alliance
              </p>
              <h2
                className="mt-3 text-5xl leading-[0.95] text-white sm:text-7xl lg:text-[5.8rem]"
                style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900, letterSpacing: '-0.05em' }}
              >
                우리동네
                <span
                  className="mt-2 block bg-[linear-gradient(90deg,#ffffff_0%,#fff1a1_28%,#b9f2c9_100%)] bg-clip-text text-transparent"
                >
                  진보정치
                </span>
              </h2>
            </div>

            <p className={`${popped ? 'intro-copy-rise intro-delay-3' : 'opacity-0'} mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg`}>
              지역의 삶을 바꾸는 후보와 공약을 가장 선명하게 보여주는,
              신호등연대 2026 지방선거 플랫폼.
            </p>

            <div className={`${popped ? 'intro-copy-rise intro-delay-4' : 'opacity-0'} mt-8 flex flex-wrap gap-3`}>
              {[
                { label: '녹색당', color: '#69BE83', text: '#08120d' },
                { label: '정의당', color: '#FEF339', text: '#181818' },
                { label: '노동당', color: '#E85451', text: '#ffffff' },
              ].map((party) => (
                <span
                  key={party.label}
                  className="rounded-full px-4 py-2 text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                  style={{ backgroundColor: party.color, color: party.text }}
                >
                  {party.label}
                </span>
              ))}
            </div>

            <p className={`${popped ? 'intro-copy-rise intro-delay-5' : 'opacity-0'} mt-10 text-sm tracking-[0.08em] text-slate-500 sm:text-base`}>
              부자들의 성장 대신, 모두의 존엄을
            </p>
          </div>

          <div className={`order-1 lg:order-2 ${popped ? 'intro-pop' : 'opacity-0'}`}>
            <div className="relative mx-auto w-full max-w-[25rem]">
              <div
                className="absolute inset-x-7 bottom-3 top-10 rounded-[3rem] border border-white/8 bg-white/6 backdrop-blur-md"
                style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.3)' }}
              />
              <div className="intro-signal-float relative mx-auto w-[14rem] sm:w-[16rem]">
                <div
                  className="absolute left-1/2 top-[-3.7rem] h-16 w-5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#6b7280,#111827)]"
                  style={{ boxShadow: '0 10px 24px rgba(0,0,0,0.35)' }}
                />
                <div
                  className="relative overflow-hidden rounded-[3rem] border border-white/10 px-5 pb-5 pt-6"
                  style={{
                    background: 'linear-gradient(180deg,rgba(39,39,42,0.96) 0%,rgba(10,10,12,0.98) 100%)',
                    boxShadow: '0 35px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="absolute inset-x-5 top-4 h-8 rounded-full bg-white/10 blur-xl" />
                  <div className="mb-5 flex justify-center">
                    <div className="h-4 w-20 rounded-full bg-black/35 ring-1 ring-white/10" />
                  </div>

                  <div className="space-y-4">
                    {LIGHTS.map(({ color, glow, delay }, index) => (
                      <div
                        key={color}
                        className="relative overflow-hidden rounded-full border border-white/10 p-3"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.14),transparent_34%)]" />
                        <div
                          className="intro-light-pulse relative mx-auto rounded-full"
                          style={{
                            width: 94,
                            height: 94,
                            backgroundColor: color,
                            animationDelay: delay,
                            '--light-glow': glow,
                            boxShadow: `inset 0 10px 24px rgba(255,255,255,0.18), inset 0 -18px 24px rgba(0,0,0,0.22), 0 0 0 8px rgba(255,255,255,0.04)`,
                          } as React.CSSProperties}
                        >
                          <div className="absolute left-[18%] top-[16%] h-7 w-7 rounded-full bg-white/32 blur-[2px]" />
                        </div>
                        <p className="mt-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.24em] text-slate-400">
                          {index === 0 ? 'voice' : index === 1 ? 'promise' : 'change'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${popped ? 'intro-copy-rise intro-delay-4' : 'opacity-0'} mt-6 text-center`}>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  green · justice · labor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

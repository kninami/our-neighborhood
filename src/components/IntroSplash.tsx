'use client';

import { useEffect, useState } from 'react';

const LIGHTS = [
  { color: '#E73A36', delay: '0s' },
  { color: '#FFED00', delay: '0.5s' },
  { color: '#50B62A', delay: '1.0s' },
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
      className={`fixed inset-0 z-[200] overflow-hidden ${sliding ? 'intro-slide-up' : ''}`}
      style={{ backgroundColor: '#0C0C0E' }}
    >
      {/* 미니멀 그리드 */}
      <div className="intro-grid absolute inset-0 opacity-40" />

      {/* 좌측 컬러 스트립 */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[linear-gradient(180deg,#E73A36_0%,#FFED00_50%,#50B62A_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center px-8 py-14 sm:px-12">
        <div className={`grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center ${popped ? 'intro-frame-in' : 'opacity-0'}`}>

          {/* 텍스트 영역 */}
          <div className="order-2 lg:order-1">
            <div className={`${popped ? 'intro-copy-rise intro-delay-1' : 'opacity-0'} inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2`}>
              <div className="flex items-center gap-1">
                {LIGHTS.map(({ color }) => (
                  <span
                    key={color}
                    className="inline-flex h-2 w-2 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-zinc-400">
                2026 Local Election Platform
              </span>
            </div>

            <div className={`${popped ? 'intro-copy-rise intro-delay-2' : 'opacity-0'} mt-7`}>
              <p
                className="text-xs uppercase tracking-[0.34em] text-zinc-500"
                style={{ fontFamily: 'var(--font-bagel)' }}
              >
                three lights alliance
              </p>
              <h2
                className="mt-3 text-5xl leading-[0.92] text-white sm:text-7xl lg:text-[5.5rem]"
                style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900, letterSpacing: '-0.05em' }}
              >
                우리동네
                <span className="mt-2 block text-zinc-300">
                  진보정치
                </span>
              </h2>
            </div>

            <p className={`${popped ? 'intro-copy-rise intro-delay-3' : 'opacity-0'} mt-6 max-w-xl text-sm leading-8 text-zinc-400 sm:text-base`}>
              지역의 삶을 바꾸는 후보와 공약을 가장 선명하게 보여주는,
              신호등연대 2026 지방선거 플랫폼.
            </p>

            <div className={`${popped ? 'intro-copy-rise intro-delay-4' : 'opacity-0'} mt-8 flex flex-wrap gap-2`}>
              {[
                { label: '녹색당', color: '#50B62A', text: '#08120d' },
                { label: '정의당', color: '#FFED00', text: '#181818' },
                { label: '노동당', color: '#E73A36', text: '#ffffff' },
              ].map((party) => (
                <span
                  key={party.label}
                  className="rounded-lg px-3.5 py-1.5 text-xs font-bold"
                  style={{ backgroundColor: party.color, color: party.text }}
                >
                  {party.label}
                </span>
              ))}
            </div>

            <p className={`${popped ? 'intro-copy-rise intro-delay-5' : 'opacity-0'} mt-10 text-xs tracking-[0.08em] text-zinc-600 sm:text-sm`}>
              부자들의 성장 대신, 모두의 존엄을
            </p>
          </div>

          {/* 신호등 일러스트 */}
          <div className={`order-1 lg:order-2 ${popped ? 'intro-pop' : 'opacity-0'}`}>
            <div className="relative mx-auto w-full max-w-[22rem]">
              <div className="intro-signal-float relative mx-auto w-[13rem] sm:w-[15rem]">
                {/* 기둥 */}
                <div
                  className="absolute left-1/2 top-[-3rem] h-12 w-4 -translate-x-1/2"
                  style={{ backgroundColor: '#2A2A2E' }}
                />
                {/* 신호등 본체 */}
                <div
                  className="relative overflow-hidden border border-white/8 px-4 pb-4 pt-5"
                  style={{
                    background: '#1A1A1E',
                    borderRadius: '16px',
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="h-3 w-16 rounded-sm bg-white/8" />
                  </div>

                  <div className="space-y-3">
                    {LIGHTS.map(({ color, delay }) => (
                      <div
                        key={color}
                        className="relative overflow-hidden rounded-lg border border-white/8 p-3"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        <div
                          className="intro-light-pulse relative mx-auto rounded-lg"
                          style={{
                            width: 88,
                            height: 88,
                            backgroundColor: color,
                            animationDelay: delay,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${popped ? 'intro-copy-rise intro-delay-4' : 'opacity-0'} mt-6 text-center`}>
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-zinc-600">
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

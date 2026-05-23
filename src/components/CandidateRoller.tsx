'use client';

import { useState, useEffect, useRef } from 'react';
import type { Candidate } from '@/types';
import { getPartyColor } from '@/lib/partyColors';

const LIGHTS = [
  { color: '#E73A36', glow: 'rgba(232,84,81,0.75)',  delay: '0s'   },
  { color: '#FFED00', glow: 'rgba(254,243,57,0.75)', delay: '0.8s' },
  { color: '#50B62A', glow: 'rgba(105,190,131,0.75)',delay: '1.6s' },
];

const INTERVAL      = 3200;
const ANIM_DURATION = 400;

type Props = { candidates: Candidate[] };

export default function CandidateRoller({ candidates }: Props) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const idxRef     = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (candidates.length < 2) return;
    const id = setInterval(() => {
      const cur  = idxRef.current;
      const next = (cur + 1) % candidates.length;
      idxRef.current = next;
      setExitingIdx(cur);
      setDisplayIdx(next);
      timeoutRef.current = setTimeout(() => setExitingIdx(null), ANIM_DURATION);
    }, INTERVAL);
    return () => {
      clearInterval(id);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [candidates.length]);

  if (candidates.length === 0) return null;

  const current = candidates[displayIdx];
  const exiting = exitingIdx !== null ? candidates[exitingIdx] : null;

  return (
    <div className="flex items-center gap-2.5 justify-end">
      {/* 신호등: 모바일에서 숨김 */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {LIGHTS.map(({ color, glow, delay }) => (
          <span
            key={color}
            className="header-light block rounded-full"
            style={{
              width: 10, height: 10,
              backgroundColor: color,
              '--light-glow': glow,
              animationDelay: delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 구분선: 모바일에서 숨김 */}
      <div className="hidden md:block w-px h-5 bg-slate-200 shrink-0" />

      {/* 롤링 후보자: 모바일은 좁게, 데스크탑은 넓게 */}
      <div
        className="relative overflow-hidden w-[220px] md:w-[260px]"
        style={{ height: '1.5em' }}
      >
        {exiting && (
          <CandidateItem
            key={`exit-${exitingIdx}`}
            candidate={exiting}
            animClass="keyword-out"
          />
        )}
        <CandidateItem
          key={`disp-${displayIdx}`}
          candidate={current}
          animClass={exitingIdx !== null ? 'keyword-in' : ''}
        />
      </div>
    </div>
  );
}

function CandidateItem({
  candidate,
  animClass,
}: {
  candidate: Candidate;
  animClass: string;
}) {
  const color = getPartyColor(candidate.party);
  return (
    <span
      className={`${animClass} absolute inset-0 flex items-center gap-2`}
      style={{ fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'nowrap' }}
    >
      {/* 당색 동그라미 (사진 대용) */}
      <span
        className="shrink-0 rounded-full"
        style={{
          width: 14, height: 14,
          backgroundColor: color.bg,
          border: `1.5px solid ${color.border}`,
        }}
      />
      <span>
        <span style={{ fontWeight: 700 }}>{candidate.region}</span>
        {' '}
        <span style={{ fontWeight: 900 }}>{candidate.name}</span>
        {' '}밀어주기
      </span>
    </span>
  );
}

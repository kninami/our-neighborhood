'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Candidate } from '@/types';
import { getPartyColor } from '@/lib/partyColors';

const REGION_SHORT: Record<string, string> = {
  서울특별시: '서울', 부산광역시: '부산', 대구광역시: '대구',
  인천광역시: '인천', 광주광역시: '광주', 대전광역시: '대전',
  울산광역시: '울산', 세종특별자치시: '세종', 경기도: '경기',
  강원도: '강원', 강원특별자치도: '강원', 충청북도: '충북',
  충청남도: '충남', 전라북도: '전북', 전북특별자치도: '전북',
  전라남도: '전남', 경상북도: '경북', 경상남도: '경남',
  제주특별자치도: '제주',
};

function getShortLocation(candidate: Candidate): string {
  const region = candidate.region?.trim() ?? '';
  const district = candidate.district?.trim() ?? '';

  // district에서 시/군 추출 시도
  const source = district || region;
  let cleaned = source
    .replace(/\s*제\s*\d+\s*선거구/gu, '')
    .replace(/\s*(갑|을|병|정)\s*선거구/gu, '')
    .replace(/\s*선거구/gu, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const short = REGION_SHORT[region] ?? region.replace(/(특별자치도|특별자치시|특별시|광역시|도)$/u, '').trim();

  // 앞의 광역 지역명 제거
  for (const prefix of [region, short]) {
    if (prefix && cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
      break;
    }
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const cityOrCounty = parts.find(p => /(시|군)$/u.test(p));
  if (cityOrCounty) return cityOrCounty.replace(/(시|군)$/u, '') || short;

  const first = parts[0] ?? '';
  if (first && !/(구|읍|면|동)$/u.test(first)) return first;

  return short || '우리동네';
}

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
  const router = useRouter();

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

  function handleClick(candidate: Candidate) {
    const params = new URLSearchParams({ candidate: candidate.id });
    if (candidate.region) params.set('region', candidate.region);
    router.push(`/?${params.toString()}`);
  }

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
      <button
        type="button"
        onClick={() => handleClick(current)}
        className="relative overflow-hidden w-[200px] md:w-[240px] text-left rounded-md hover:bg-zinc-100 transition-colors px-1"
        style={{ height: '1.5em' }}
        aria-label={`${current.name} 후보 정보 보기`}
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
      </button>
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
        <span style={{ fontWeight: 700 }}>{getShortLocation(candidate)}</span>
        {' '}
        <span style={{ fontWeight: 900 }}>{candidate.name}</span>
        {' '}밀어주기
      </span>
    </span>
  );
}

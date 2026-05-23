'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPartyColor } from '@/lib/partyColors';
import type { Candidate } from '@/types';

type RegionResult = { type: 'region'; region: string; count: number };
type CandidateResult = { type: 'candidate'; candidate: Candidate };
type Result = RegionResult | CandidateResult;

type Props = { candidates: Candidate[] };

export default function SearchBar({ candidates }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const trimmed = query.trim();

  const results: Result[] = trimmed.length < 1 ? [] : (() => {
    const q = trimmed;

    // 지역 매칭: 고유 지역명에서 검색
    const regionMap = new Map<string, number>();
    for (const c of candidates) {
      if (c.region) regionMap.set(c.region, (regionMap.get(c.region) ?? 0) + 1);
    }
    const regionResults: RegionResult[] = [...regionMap.entries()]
      .filter(([region]) => region.includes(q))
      .map(([region, count]) => ({ type: 'region' as const, region, count }))
      .slice(0, 3);

    // 후보자 매칭: 이름 / 지역 / 선거구 / 당으로 검색
    const candidateResults: CandidateResult[] = candidates
      .filter(c =>
        c.name.includes(q) ||
        c.district.includes(q) ||
        c.party.includes(q)
      )
      .slice(0, 8)
      .map(c => ({ type: 'candidate', candidate: c }));

    return [...regionResults, ...candidateResults];
  })();

  const showDropdown = focused && trimmed.length >= 1;

  const selectResult = useCallback((result: Result) => {
    if (result.type === 'region') {
      router.push(`/?region=${encodeURIComponent(result.region)}`);
    } else {
      const params = new URLSearchParams({
        region: result.candidate.region,
        candidate: result.candidate.id,
      });
      router.push(`/?${params}`);
    }
    setQuery('');
    setActiveIdx(-1);
    inputRef.current?.blur();
  }, [router]);

  // 키보드 탐색
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        selectResult(results[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  // activeIdx 변경시 스크롤 추적
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      listRef.current.children[activeIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // query 바뀌면 activeIdx 초기화
  useEffect(() => setActiveIdx(-1), [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[380px]">
      {/* 입력창 */}
      <div className="relative flex items-center">
        <svg
          className="absolute left-3.5 w-4 h-4 pointer-events-none z-10 transition-colors duration-150"
          style={{ color: focused ? '#18181B' : '#A1A1AA' }}
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="후보자 이름 또는 지역 검색"
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-150"
          style={{
            backgroundColor: focused ? '#fff' : '#F4F4F5',
            border: `1.5px solid ${focused ? '#18181B' : '#E4E4E7'}`,
            color: '#18181B',
          }}
        />
        {query && (
          <button
            type="button"
            onPointerDown={e => { e.preventDefault(); setQuery(''); setActiveIdx(-1); }}
            className="absolute right-3 text-zinc-400 hover:text-zinc-700"
            aria-label="검색어 지우기"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 드롭다운 */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-400">검색 결과가 없습니다</p>
          ) : (
            <ul ref={listRef} className="max-h-72 overflow-y-auto" role="listbox">
              {results.map((result, idx) => {
                const isActive = idx === activeIdx;
                if (result.type === 'region') {
                  return (
                    <li key={`region-${result.region}`} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onPointerDown={e => { e.preventDefault(); selectResult(result); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        style={{ backgroundColor: isActive ? '#F4F4F5' : 'transparent' }}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#CFE8FC]">
                          <svg className="h-3.5 w-3.5 text-[#3a7fb5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-800">{result.region}</p>
                          <p className="text-xs text-zinc-400">후보자 {result.count}명</p>
                        </div>
                      </button>
                    </li>
                  );
                }

                const { candidate } = result;
                const color = getPartyColor(candidate.party);
                return (
                  <li key={`candidate-${candidate.id}`} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onPointerDown={e => { e.preventDefault(); selectResult(result); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{ backgroundColor: isActive ? '#F4F4F5' : 'transparent' }}
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        {(candidate.party || '무')[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-zinc-800">{candidate.name}</span>
                          <span className="text-xs text-zinc-400">{candidate.party}</span>
                        </div>
                        <p className="truncate text-xs text-zinc-400">
                          {candidate.region}{candidate.district ? ` · ${candidate.district}` : ''}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

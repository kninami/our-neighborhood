'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import CandidateDetailPanel from './CandidateDetailPanel';
import CandidateShareButton from './CandidateShareButton';
import KoreaMap from './KoreaMap';
import { getPartyColor } from '@/lib/partyColors';
import type { Candidate, Policy, RegionalAgenda } from '@/types';

const TYPE_PRIORITY: Record<string, number> = {
  // 광역단체장
  '광역단체장': 0,
  '서울시장': 0,
  '특별시장': 0,
  '도지사': 0,
  // 광역의원
  '광역의원': 1,
  '도의원': 1,
  // 광역비례
  '광역비례': 2,
  // 광역비례 1
  '광역비례1': 3,
  '광역비례 1': 3,
  // 광역비례 2
  '광역비례2': 4,
  '광역비례 2': 4,
  // 기초단체장
  '기초단체장': 5,
  '시장': 5,
  '구청장': 5,
  '군수': 5,
  // 기초의원
  '기초의원': 6,
  '시의원': 6,
  '구의원': 6,
  '군의원': 6,
  // 기초비례
  '기초비례': 7,
};

type Tab = 'candidates' | 'policy' | 'agenda';

type Props = {
  candidates: Candidate[];
  policies: Policy[];
  agendas: RegionalAgenda[];
  initialRegion?: string | null;
  initialCandidateId?: string | null;
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'candidates', label: '후보자' },
  { id: 'policy', label: '정책' },
  { id: 'agenda', label: '현안과 의제' },
];

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.3;

function getTypePriority(type: string): number {
  return TYPE_PRIORITY[type.trim()] ?? 7;
}

function groupByType(candidates: Candidate[]): [string, Candidate[]][] {
  const map = new Map<string, Candidate[]>();

  for (const candidate of candidates) {
    const key = candidate.candidateType.trim() || '기타';
    const list = map.get(key) ?? [];
    list.push(candidate);
    map.set(key, list);
  }

  return [...map.entries()].sort(
    ([a], [b]) => getTypePriority(a) - getTypePriority(b),
  );
}

export default function MapPage({
  candidates,
  policies,
  agendas,
  initialRegion = null,
  initialCandidateId = null,
}: Props) {
  const initialCandidate = initialCandidateId
    ? candidates.find((candidate) => candidate.id === initialCandidateId) ?? null
    : null;
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    initialCandidate?.region || initialRegion,
  );
  const [activeTab, setActiveTab] = useState<Tab>('candidates');
  const [zoom, setZoom] = useState(1);
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(initialCandidate);

  // 검색 등으로 URL이 바뀌면 prop이 변경되므로 state를 동기화
  useEffect(() => {
    if (initialCandidateId) {
      const found = candidates.find(c => c.id === initialCandidateId) ?? null;
      if (found) {
        setSelectedRegion(found.region || null);
        setModalCandidate(found);
      }
    } else if (initialRegion) {
      setSelectedRegion(initialRegion);
      setModalCandidate(null);
    }
  // candidates 배열 참조 변화로 인한 불필요한 재실행 방지
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCandidateId, initialRegion]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const candidate of candidates) {
      if (candidate.region) {
        counts[candidate.region] = (counts[candidate.region] ?? 0) + 1;
      }
    }

    return counts;
  }, [candidates]);

  const regionCandidates = useMemo(
    () => (
      selectedRegion
        ? candidates.filter((candidate) => candidate.region === selectedRegion)
        : []
    ),
    [candidates, selectedRegion],
  );

  const grouped = useMemo(() => groupByType(regionCandidates), [regionCandidates]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextRegion = modalCandidate?.region || selectedRegion;

    if (nextRegion) {
      params.set('region', nextRegion);
    } else {
      params.delete('region');
    }

    if (modalCandidate) {
      params.set('candidate', modalCandidate.id);
    } else {
      params.delete('candidate');
    }

    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, [modalCandidate, selectedRegion]);

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedRegion(candidate.region || null);
    setModalCandidate(candidate);
  };

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* 지도 패널 */}
        <div
          className="shrink-0 p-4 lg:sticky lg:top-0 lg:min-h-screen lg:w-[38%] lg:self-start"
          style={{ backgroundColor: '#CFE8FC' }}
        >
          <div className="relative mx-auto flex w-full max-w-[42rem] flex-col items-center">
            <KoreaMap
              selectedRegion={selectedRegion}
              regionCounts={regionCounts}
              onRegionSelect={setSelectedRegion}
              zoom={zoom}
            />

            <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
              <button
                onClick={() => setZoom((value) => Math.min(+(value + ZOOM_STEP).toFixed(2), MAX_ZOOM))}
                disabled={zoom >= MAX_ZOOM}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold border border-zinc-200 transition-colors disabled:opacity-30 bg-white text-zinc-600 hover:bg-zinc-50"
                aria-label="지도 확대"
              >
                +
              </button>
              <button
                onClick={() => setZoom((value) => Math.max(+(value - ZOOM_STEP).toFixed(2), MIN_ZOOM))}
                disabled={zoom <= MIN_ZOOM}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold border border-zinc-200 transition-colors disabled:opacity-30 bg-white text-zinc-600 hover:bg-zinc-50"
                aria-label="지도 축소"
              >
                −
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-zinc-400">
            지도에서 지역을 클릭하면 후보자 목록을 볼 수 있습니다
          </p>
        </div>

        {/* 후보자 목록 패널 */}
        <div className="flex flex-col border-t border-zinc-200 bg-white lg:w-[62%] lg:border-l lg:border-t-0">
          {/* 탭 */}
          <div className="flex shrink-0 border-b border-zinc-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 py-3 text-sm font-semibold transition-colors"
                style={{ color: activeTab === tab.id ? '#18181B' : '#A1A1AA' }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18181B]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {activeTab === 'candidates' && (
              selectedRegion ? (
                <CandidateList
                  region={selectedRegion}
                  grouped={grouped}
                  total={regionCandidates.length}
                  onSelect={handleCandidateSelect}
                  onReset={() => setSelectedRegion(null)}
                />
              ) : (
                <CandidateGrid
                  candidates={candidates}
                  onSelect={handleCandidateSelect}
                />
              )
            )}

            {activeTab === 'policy' && (
              <PolicyTab policies={policies} />
            )}

            {activeTab === 'agenda' && (
              <AgendaTab agendas={agendas} region={selectedRegion} />
            )}
          </div>
        </div>
      </div>

      {modalCandidate && (
        <CandidateModal
          candidate={modalCandidate}
          onClose={() => setModalCandidate(null)}
        />
      )}
    </>
  );
}

function PolicyTab({ policies }: { policies: Policy[] }) {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const parties = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of policies) {
      if (p.party && !seen.has(p.party)) {
        seen.add(p.party);
        result.push(p.party);
      }
    }
    return result;
  }, [policies]);

  const areas = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of policies) {
      if (p.area && !seen.has(p.area)) {
        seen.add(p.area);
        result.push(p.area);
      }
    }
    return result;
  }, [policies]);

  const filtered = policies.filter(
    (p) =>
      (selectedParty === null || p.party === selectedParty) &&
      (selectedArea === null || p.area === selectedArea),
  );

  if (policies.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center lg:min-h-screen">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-700">정책 정보가 없습니다</p>
          <p className="text-xs text-zinc-400">곧 업데이트될 예정입니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">정책</h2>
        <p className="mt-1 text-base text-zinc-500">{filtered.length}개 정책</p>
      </div>

      {/* 정당 필터 */}
      <div className="mb-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">제안 정당</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedParty(null)}
          className="rounded-full px-3 py-1 text-sm font-semibold transition-colors"
          style={
            selectedParty === null
              ? { backgroundColor: '#18181B', color: '#fff' }
              : { backgroundColor: '#f4f4f5', color: '#52525b' }
          }
        >
          전체
        </button>
        {parties.map((party) => {
          const c = getPartyColor(party);
          const isSelected = selectedParty === party;
          return (
            <button
              key={party}
              onClick={() => setSelectedParty(isSelected ? null : party)}
              className="rounded-full px-3 py-1 text-sm font-semibold transition-colors"
              style={
                isSelected
                  ? { backgroundColor: c.bg, color: c.text }
                  : { backgroundColor: '#f4f4f5', color: '#52525b' }
              }
            >
              {party}
            </button>
          );
        })}
      </div>
      </div>

      {/* 분야 필터 */}
      <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">정책 분야</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedArea(null)}
          className="rounded-full px-3 py-1 text-sm font-semibold transition-colors"
          style={
            selectedArea === null
              ? { backgroundColor: '#18181B', color: '#fff' }
              : { backgroundColor: '#f4f4f5', color: '#52525b' }
          }
        >
          전체
        </button>
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(selectedArea === area ? null : area)}
            className="rounded-full px-3 py-1 text-sm font-semibold transition-colors"
            style={
              selectedArea === area
                ? { backgroundColor: '#18181B', color: '#fff' }
                : { backgroundColor: '#f4f4f5', color: '#52525b' }
            }
          >
            {area}
          </button>
        ))}
      </div>
      </div>

      <ul className="grid gap-3">
        {filtered.map((policy, index) => {
          const color = getPartyColor(policy.party);
          return (
            <li
              key={`${policy.title}-${index}`}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="px-4 py-4">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  {policy.party && (
                    <span
                      className="rounded-md px-2 py-0.5 text-sm font-semibold"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {policy.party}
                    </span>
                  )}
                  {policy.area && (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-sm font-semibold text-zinc-600">
                      {policy.area}
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-zinc-900 sm:text-xl">{policy.title || '제목 미정'}</p>
                {policy.content && (
                  <ul className="mt-1.5 space-y-1">
                    {policy.content
                      .split(/[-△]/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={i} className="flex gap-2 text-base leading-7 text-zinc-600">
                          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                          {line}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const AGENDA_PALETTE = [
  '#E73A36',
  '#3B82F6',
  '#50B62A',
  '#F9602B',
  '#8B5CF6',
  '#F59E0B',
  '#10B981',
  '#EC4899',
];

function buildCategoryColorMap(agendas: RegionalAgenda[]): Map<string, string> {
  const map = new Map<string, string>();
  let i = 0;
  for (const a of agendas) {
    if (a.category && !map.has(a.category)) {
      map.set(a.category, AGENDA_PALETTE[i % AGENDA_PALETTE.length]);
      i++;
    }
  }
  return map;
}

function AgendaTab({
  agendas,
  region,
}: {
  agendas: RegionalAgenda[];
  region: string | null;
}) {
  const filtered = region
    ? agendas.filter((a) => a.region === region)
    : agendas;

  const colorMap = buildCategoryColorMap(filtered);

  if (filtered.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center lg:min-h-screen">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-zinc-700">
            {region ? `${region} 현안과 의제` : '현안과 의제'} 정보가 없습니다
          </p>
          <p className="text-xs text-zinc-400">지도에서 지역을 선택하면 해당 지역 의제를 볼 수 있습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">
          {region ? `${region} 현안과 의제` : '현안과 의제'}
        </h2>
        <p className="mt-1 text-base text-zinc-500">{filtered.length}개 의제</p>
      </div>
      <ul className="grid gap-3">
        {filtered.map((agenda, index) => {
          const color = colorMap.get(agenda.category) ?? '#94a3b8';
          return (
            <li
              key={`${agenda.title}-${agenda.category}-${index}`}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="px-4 py-4">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  {agenda.region && !region && (
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-sm font-semibold text-zinc-600">
                      {agenda.region}
                    </span>
                  )}
                  {agenda.category && (
                    <span
                      className="rounded-md px-2 py-0.5 text-sm font-semibold"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {agenda.category}
                    </span>
                  )}
                  {agenda.localArea && (
                    <span className="rounded-md bg-zinc-50 px-2 py-0.5 text-sm font-medium text-zinc-500">
                      {agenda.localArea}
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-zinc-900 sm:text-xl">{agenda.title || '제목 미정'}</p>
                {agenda.content && (
                  <ul className="mt-1.5 space-y-1">
                    {agenda.content.split(/[-△]/).map((s) => s.trim()).filter(Boolean).map((line, i) => (
                      <li key={i} className="flex gap-2 text-base leading-7 text-zinc-600">
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
                {agenda.relatedPolicy && (
                  <div className="mt-3">
                    <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
                      <p className="mb-2 text-sm font-bold text-zinc-700">관련 정책</p>
                      <ul className="space-y-1">
                        {agenda.relatedPolicy.split(/[-△]/).map((s) => s.trim()).filter(Boolean).map((line, i) => (
                          <li key={i} className="flex gap-2 text-base leading-7 text-zinc-700">
                            <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CandidateGrid({
  candidates: allCandidates,
  onSelect,
}: {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
}) {
  const grouped = useMemo(() => groupByType(allCandidates), [allCandidates]);

  return (
    <div className="p-5 sm:p-6">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight text-zinc-900">전체 후보자</h2>
        <p className="mt-1 text-base text-zinc-500">후보자 {allCandidates.length}명</p>
      </div>

      {grouped.map(([type, list]) => (
        <section key={type} className="mb-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900">{type}</h3>
            <span className="text-base font-semibold text-zinc-400">{list.length}명</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => onSelect(candidate)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CandidateList({
  region,
  grouped,
  total,
  onSelect,
  onReset,
}: {
  region: string;
  grouped: [string, Candidate[]][];
  total: number;
  onSelect: (candidate: Candidate) => void;
  onReset: () => void;
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-black tracking-tight text-zinc-900">{region}</h2>
          <button
            onClick={onReset}
            className="flex items-center justify-center rounded-lg border border-zinc-200 p-1.5 text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-700"
            aria-label="전체 후보자 보기"
            title="전체 후보자 보기"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-base text-zinc-500">후보자 {total}명</p>
      </div>

      {grouped.length === 0 && (
        <p className="text-base text-zinc-400">등록된 후보자가 없습니다.</p>
      )}

      {grouped.map(([type, list]) => (
        <section key={type} className="mb-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900">{type}</h3>
            <span className="text-base font-semibold text-zinc-400">{list.length}명</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => onSelect(candidate)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CandidateCard({
  candidate,
  onClick,
}: {
  candidate: Candidate;
  onClick: () => void;
}) {
  const color = getPartyColor(candidate.party);

  return (
    <button
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-zinc-300 hover:shadow-md"
    >
      {/* 당색 탑 스트립 */}
      <div className="h-[5px] w-full shrink-0" style={{ backgroundColor: color.bg }} />

      {/* 사진 */}
      <div className="relative w-full overflow-hidden bg-zinc-100" style={{ aspectRatio: '4/3' }}>
        {candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={candidate.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={40}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-10 w-10 text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a8.25 8.25 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <span
          className="mb-2 inline-block self-start rounded-md px-2.5 py-0.5 text-sm font-bold"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {candidate.party || '무소속'}
        </span>
        <p className="text-2xl font-black leading-snug text-zinc-900">{candidate.name}</p>
        {(candidate.district || candidate.region) && (
          <p className="mt-1.5 text-sm leading-snug text-zinc-500">
            {candidate.district || candidate.region}
          </p>
        )}
      </div>
    </button>
  );
}

function CandidateModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const shareParams = new URLSearchParams({
    candidate: candidate.id,
  });

  if (candidate.region) {
    shareParams.set('region', candidate.region);
  }

  const sharePath = `/?${shareParams.toString()}`;
  const audienceLabel = getAudienceLabel(candidate);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-card relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl bg-white border border-zinc-200"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-title"
      >
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
          <CandidateShareButton
            candidateName={candidate.name}
            audienceLabel={audienceLabel}
            sharePath={sharePath}
          />

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-white border border-zinc-200 p-2 text-zinc-500 transition-colors hover:text-zinc-800 hover:border-zinc-300"
            aria-label="닫기"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[92vh] overflow-y-auto">
          <div id="candidate-modal-title" className="sr-only">
            {candidate.name} 후보 상세 정보
          </div>
          <CandidateDetailPanel
            candidate={candidate}
            compact
          />
        </div>
      </div>
    </div>
  );
}

function getAudienceLabel(candidate: Candidate): string {
  const region = candidate.region.trim();
  const district = candidate.district.trim();
  const regionShortMap: Record<string, string> = {
    서울특별시: '서울',
    부산광역시: '부산',
    대구광역시: '대구',
    인천광역시: '인천',
    광주광역시: '광주',
    대전광역시: '대전',
    울산광역시: '울산',
    세종특별자치시: '세종',
    경기도: '경기',
    강원도: '강원',
    강원특별자치도: '강원',
    충청북도: '충북',
    충청남도: '충남',
    전라북도: '전북',
    전북특별자치도: '전북',
    전라남도: '전남',
    경상북도: '경북',
    경상남도: '경남',
    제주특별자치도: '제주',
  };
  const regionShort = regionShortMap[region] ?? region;
  const regionRoot = region.replace(/(특별자치도|특별자치시|특별시|광역시|도)$/u, '').trim();
  const source = district || region;

  if (!source) {
    return '이 지역';
  }

  let cleaned = source
    .replace(/\s*제\s*\d+\s*선거구/gu, '')
    .replace(/\s*(갑|을|병|정|무|기|가|나|다|라|마|바|사|아|자|차|카|타|파|하)\s*선거구/gu, '')
    .replace(/\s*선거구/gu, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.startsWith(region)) {
    cleaned = cleaned.slice(region.length).trim();
  } else if (regionRoot && cleaned.startsWith(regionRoot)) {
    cleaned = cleaned.slice(regionRoot.length).trim();
  } else if (regionShort && cleaned.startsWith(regionShort)) {
    cleaned = cleaned.slice(regionShort.length).trim();
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    return regionShort || '이 지역';
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const cityOrCounty = parts.find((part) => /(시|군)$/u.test(part));

  if (cityOrCounty) {
    return cityOrCounty.replace(/(시|군)$/u, '') || regionShort || cityOrCounty;
  }

  const firstPart = parts[0] ?? '';

  if (firstPart && !/(구|읍|면|동)$/u.test(firstPart)) {
    return firstPart;
  }

  return regionShort || firstPart || '이 지역';
}

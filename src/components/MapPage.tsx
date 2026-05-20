'use client';

import { useEffect, useMemo, useState } from 'react';
import CandidateDetailPanel from './CandidateDetailPanel';
import CandidateShareButton from './CandidateShareButton';
import KoreaMap from './KoreaMap';
import { getPartyColor } from '@/lib/partyColors';
import type { Candidate, CandidatePolicy, RegionalAgenda } from '@/types';

const TYPE_PRIORITY: Record<string, number> = {
  '서울시장': 0,
  '특별시장': 0,
  '시장': 1,
  '구청장': 2,
  '군수': 2,
  '도의원': 3,
  '시의원': 3,
  '광역비례': 4,
  '광역비례1': 4,
  '광역비례2': 4,
  '기초비례': 5,
  '구의원': 6,
  '군의원': 6,
};

type Tab = 'candidates' | 'policy' | 'agenda';

type Props = {
  candidates: Candidate[];
  policies: CandidatePolicy[];
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
        <div
          className="shrink-0 p-4 lg:sticky lg:top-0 lg:min-h-screen lg:w-2/5 lg:self-start"
          style={{ backgroundColor: '#CFE8FC' }}
        >
          <div className="relative mx-auto flex w-full max-w-[42rem] flex-col items-center">
            <KoreaMap
              selectedRegion={selectedRegion}
              regionCounts={regionCounts}
              onRegionSelect={setSelectedRegion}
              zoom={zoom}
            />

            <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
              <button
                onClick={() => setZoom((value) => Math.min(+(value + ZOOM_STEP).toFixed(2), MAX_ZOOM))}
                disabled={zoom >= MAX_ZOOM}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-colors disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#475569' }}
                aria-label="지도 확대"
              >
                +
              </button>
              <button
                onClick={() => setZoom((value) => Math.max(+(value - ZOOM_STEP).toFixed(2), MIN_ZOOM))}
                disabled={zoom <= MIN_ZOOM}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold shadow-md transition-colors disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#475569' }}
                aria-label="지도 축소"
              >
                −
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs" style={{ color: '#6899b8' }}>
            지도에서 지역을 클릭하면 후보자 목록을 볼 수 있습니다
          </p>
        </div>

        <div className="flex flex-col border-t border-slate-200 bg-white lg:w-3/5 lg:border-l lg:border-t-0">
          <div className="flex shrink-0 border-b border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 py-3 text-sm font-semibold transition-colors"
                style={{ color: activeTab === tab.id ? '#111111' : '#94a3b8' }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111111]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {activeTab === 'candidates' && (
              !selectedRegion ? (
                <EmptyState totalCount={candidates.length} />
              ) : (
                <CandidateList
                  region={selectedRegion}
                  grouped={grouped}
                  total={regionCandidates.length}
                  onSelect={handleCandidateSelect}
                />
              )
            )}

            {activeTab === 'policy' && (
              <ComingSoon label="정책" region={selectedRegion} />
            )}

            {activeTab === 'agenda' && (
              <ComingSoon label="현안과 의제" region={selectedRegion} />
            )}
          </div>
        </div>
      </div>

      {modalCandidate && (
        <CandidateModal
          candidate={modalCandidate}
          policies={policies}
          agendas={agendas}
          onClose={() => setModalCandidate(null)}
        />
      )}
    </>
  );
}

function ComingSoon({
  label,
  region,
}: {
  label: string;
  region: string | null;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center lg:min-h-screen">
      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#f0f7ff' }}>
        <svg className="h-6 w-6" style={{ color: '#6899b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>
      <div>
        <p className="mb-1 text-base font-semibold text-slate-700">
          {region ? `${region} ${label}` : label} 정보를 준비 중입니다
        </p>
        <p className="text-sm text-slate-400">곧 업데이트될 예정입니다</p>
      </div>
    </div>
  );
}

function EmptyState({ totalCount }: { totalCount: number }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 p-8 text-center lg:min-h-screen">
      <div className="flex gap-3">
        <div className="h-16 w-6 rounded-full bg-[#E85451] opacity-80" />
        <div className="h-16 w-6 rounded-full bg-[#FEF339] opacity-80" />
        <div className="h-16 w-6 rounded-full bg-[#69BE83] opacity-80" />
      </div>
      <div>
        <p className="mb-1 text-lg font-semibold text-slate-700">
          지도에서 지역을 선택하세요
        </p>
        <p className="text-sm text-slate-400">
          전국 후보자 {totalCount.toLocaleString()}명이 등록되어 있습니다
        </p>
      </div>
    </div>
  );
}

function CandidateList({
  region,
  grouped,
  total,
  onSelect,
}: {
  region: string;
  grouped: [string, Candidate[]][];
  total: number;
  onSelect: (candidate: Candidate) => void;
}) {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">{region}</h2>
        <p className="mt-0.5 text-sm text-slate-500">후보자 {total}명</p>
      </div>

      {grouped.length === 0 && (
        <p className="text-sm text-slate-400">등록된 후보자가 없습니다.</p>
      )}

      {grouped.map(([type, list]) => (
        <section key={type} className="mb-6">
          <h3 className="mb-2 border-b border-slate-100 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {type}
          </h3>
          <ul className="flex flex-col gap-2">
            {list.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => onSelect(candidate)}
              />
            ))}
          </ul>
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
    <li>
      <button
        onClick={onClick}
        className="group flex w-full items-center gap-3 rounded-lg border border-slate-100 p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
        style={{ borderLeftColor: color.border, borderLeftWidth: 4 }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800 group-hover:text-slate-900">
              {candidate.name}
            </span>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {candidate.party || '무소속'}
            </span>
          </div>
          {candidate.district && (
            <p className="mt-0.5 truncate text-xs text-slate-400">
              {candidate.district}
              {candidate.candidateType ? ` · ${candidate.candidateType}` : ''}
            </p>
          )}
        </div>
        <svg
          className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </li>
  );
}

function CandidateModal({
  candidate,
  policies,
  agendas,
  onClose,
}: {
  candidate: Candidate;
  policies: CandidatePolicy[];
  agendas: RegionalAgenda[];
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
      style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="modal-card relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]"
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
            className="rounded-full bg-white/92 p-2 text-slate-500 shadow-sm transition-colors hover:text-slate-700"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[92vh] overflow-y-auto p-3 sm:p-5">
          <div id="candidate-modal-title" className="sr-only">
            {candidate.name} 후보 상세 정보
          </div>
          <CandidateDetailPanel
            candidate={candidate}
            policies={policies}
            agendas={agendas}
            compact
          />
        </div>
      </div>
    </div>
  );
}

function getAudienceLabel(candidate: Candidate): string {
  const source = candidate.district.trim() || candidate.region.trim();

  if (!source) {
    return '이 지역';
  }

  const withoutElectionDistrict = source
    .replace(/\s*제\s*\d+\s*선거구/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const firstChunk = withoutElectionDistrict.split(/[·,(]/)[0]?.trim() || withoutElectionDistrict;
  const softened = firstChunk.replace(/(특별자치도|특별자치시|특별시|광역시|도|시|군)$/u, '').trim();

  return softened || firstChunk || source;
}

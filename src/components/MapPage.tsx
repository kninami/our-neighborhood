'use client';

import { useState, useMemo, useEffect } from 'react';
import KoreaMap from './KoreaMap';
import { getPartyColor } from '@/lib/partyColors';
import type { Candidate } from '@/types';

// 광역단체장 → 기초단체장 → 광역의원 → 광역비례 → 기초비례 → 기초의원
const TYPE_PRIORITY: Record<string, number> = {
  '서울시장':  0,
  '특별시장':  0,
  '시장':      1,
  '구청장':    2,
  '군수':      2,
  '도의원':    3,
  '시의원':    3,
  '광역비례':  4,
  '광역비례1': 4,
  '광역비례2': 4,
  '기초비례':  5,
  '구의원':    6,
  '군의원':    6,
};

function getTypePriority(type: string): number {
  return TYPE_PRIORITY[type.trim()] ?? 7;
}

function groupByType(candidates: Candidate[]): [string, Candidate[]][] {
  const map = new Map<string, Candidate[]>();
  for (const c of candidates) {
    const key = c.candidateType.trim() || '기타';
    const list = map.get(key) ?? [];
    list.push(c);
    map.set(key, list);
  }
  return [...map.entries()].sort(
    ([a], [b]) => getTypePriority(a) - getTypePriority(b),
  );
}

type Tab = 'candidates' | 'policy' | 'agenda';

const TABS: { id: Tab; label: string }[] = [
  { id: 'candidates', label: '후보자' },
  { id: 'policy',     label: '정책' },
  { id: 'agenda',     label: '현안과 의제' },
];

type Props = { candidates: Candidate[] };

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.3;

export default function MapPage({ candidates }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('candidates');
  const [zoom, setZoom] = useState(1);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of candidates) {
      if (c.region) counts[c.region] = (counts[c.region] ?? 0) + 1;
    }
    return counts;
  }, [candidates]);

  const regionCandidates = useMemo(
    () => (selectedRegion ? candidates.filter((c) => c.region === selectedRegion) : []),
    [candidates, selectedRegion],
  );

  const grouped = useMemo(() => groupByType(regionCandidates), [regionCandidates]);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* ── Map pane: 40%, sticky ── */}
        <div
          className="lg:w-2/5 p-4 flex flex-col items-center lg:sticky lg:top-0 lg:self-start lg:min-h-screen shrink-0"
          style={{ backgroundColor: '#CFE8FC' }}
        >
          <div className="relative w-full">
            <KoreaMap
              selectedRegion={selectedRegion}
              regionCounts={regionCounts}
              onRegionSelect={setSelectedRegion}
              zoom={zoom}
            />
            <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
              <button
                onClick={() => setZoom(z => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM))}
                disabled={zoom >= MAX_ZOOM}
                className="w-10 h-10 rounded-lg shadow-md font-bold text-xl flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#475569' }}
                aria-label="지도 확대"
              >+</button>
              <button
                onClick={() => setZoom(z => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM))}
                disabled={zoom <= MIN_ZOOM}
                className="w-10 h-10 rounded-lg shadow-md font-bold text-xl flex items-center justify-center transition-colors disabled:opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#475569' }}
                aria-label="지도 축소"
              >−</button>
            </div>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: '#6899b8' }}>
            지도에서 지역을 클릭하면 후보자 목록을 볼 수 있습니다
          </p>
        </div>

        {/* ── Right panel: 60% ── */}
        <div className="lg:w-3/5 bg-white border-t border-slate-200 lg:border-t-0 lg:border-l flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3 text-sm font-semibold transition-colors relative"
                style={{ color: activeTab === tab.id ? '#E26419' : '#94a3b8' }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E26419]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1">
            {activeTab === 'candidates' && (
              !selectedRegion ? (
                <EmptyState totalCount={candidates.length} />
              ) : (
                <CandidateList
                  region={selectedRegion}
                  grouped={grouped}
                  total={regionCandidates.length}
                  onSelect={setModalCandidate}
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

      {/* ── Modal ── */}
      {modalCandidate && (
        <CandidateModal
          candidate={modalCandidate}
          onClose={() => setModalCandidate(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Coming soon
// ─────────────────────────────────────────────
function ComingSoon({ label, region }: { label: string; region: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] lg:min-h-screen gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0f7ff' }}>
        <svg className="w-6 h-6" style={{ color: '#6899b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>
      <div>
        <p className="text-slate-700 text-base font-semibold mb-1">
          {region ? `${region} ${label}` : label} 정보를 준비 중입니다
        </p>
        <p className="text-slate-400 text-sm">곧 업데이트될 예정입니다</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState({ totalCount }: { totalCount: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] lg:min-h-screen gap-6 p-8 text-center">
      <div className="flex gap-3">
        <div className="w-6 h-16 rounded-full bg-[#E85451] opacity-80" />
        <div className="w-6 h-16 rounded-full bg-[#FEF339] opacity-80" />
        <div className="w-6 h-16 rounded-full bg-[#69BE83] opacity-80" />
      </div>
      <div>
        <p className="text-slate-700 text-lg font-semibold mb-1">
          지도에서 지역을 선택하세요
        </p>
        <p className="text-slate-400 text-sm">
          전국 후보자 {totalCount.toLocaleString()}명이 등록되어 있습니다
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Candidate list
// ─────────────────────────────────────────────
function CandidateList({
  region,
  grouped,
  total,
  onSelect,
}: {
  region: string;
  grouped: [string, Candidate[]][];
  total: number;
  onSelect: (c: Candidate) => void;
}) {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">{region}</h2>
        <p className="text-sm text-slate-500 mt-0.5">후보자 {total}명</p>
      </div>

      {grouped.length === 0 && (
        <p className="text-slate-400 text-sm">등록된 후보자가 없습니다.</p>
      )}

      {grouped.map(([type, list]) => (
        <section key={type} className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">
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

// ─────────────────────────────────────────────
// Candidate card (button, no navigation)
// ─────────────────────────────────────────────
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
        className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
        style={{ borderLeftColor: color.border, borderLeftWidth: 4 }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 group-hover:text-slate-900">
              {candidate.name}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {candidate.party || '무소속'}
            </span>
          </div>
          {candidate.district && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{candidate.district}</p>
          )}
        </div>
        <svg
          className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </li>
  );
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────
function CandidateModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const color = getPartyColor(candidate.party);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="modal-card bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-name"
      >
        {/* Colored top bar — overflow-hidden clips to parent's rounded corners */}
        <div className="h-1.5" style={{ backgroundColor: color.bg }} />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="flex items-start gap-3 mb-5 pr-6">
            <div className="flex-1">
              <h2 id="modal-name" className="text-2xl font-bold text-slate-800">
                {candidate.name}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{candidate.region}</p>
            </div>
            <span
              className="text-sm px-3 py-1 rounded-full font-semibold shrink-0 mt-0.5"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {candidate.party || '무소속'}
            </span>
          </div>

          {/* Meta */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-6">
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">출마 유형</dt>
              <dd className="font-medium text-slate-700">{candidate.candidateType || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">지역구</dt>
              <dd className="font-medium text-slate-700">{candidate.district || '—'}</dd>
            </div>
          </dl>

          {/* Pledge placeholder */}
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f0f7ff' }}>
            <p className="text-sm" style={{ color: '#6899b8' }}>공약 정보가 곧 업데이트됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

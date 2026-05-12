import Link from 'next/link';
import { getCandidates } from '@/lib/sheets';
import { getPartyColor } from '@/lib/partyColors';

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidates = await getCandidates();
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-slate-500 text-lg">후보자를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-slate-400 hover:text-slate-600 underline"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const color = getPartyColor(candidate.party);

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {candidate.region} 목록으로
      </Link>

      <div
        className="rounded-2xl border-2 p-6"
        style={{ borderColor: color.border }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-800">{candidate.name}</h2>
          <span
            className="text-sm px-3 py-1 rounded-full font-semibold shrink-0"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {candidate.party || '무소속'}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-4">
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">지역</dt>
            <dd className="font-medium text-slate-700">{candidate.region || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">지역구</dt>
            <dd className="font-medium text-slate-700">{candidate.district || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">출마 유형</dt>
            <dd className="font-medium text-slate-700">{candidate.candidateType || '—'}</dd>
          </div>
        </dl>
      </div>

      {/* Placeholder for future pledge/profile data */}
      <div className="mt-8 p-6 rounded-xl bg-slate-50 border border-slate-100 text-center">
        <p className="text-slate-400 text-sm">공약 정보가 곧 업데이트됩니다.</p>
      </div>
    </div>
  );
}

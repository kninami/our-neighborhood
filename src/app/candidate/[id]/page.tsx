import Link from 'next/link';
import CandidateDetailPanel from '@/components/CandidateDetailPanel';
import { getCandidateById, getPolicies } from '@/lib/sheets';

export default async function CandidatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ region?: string }>;
}) {
  const { id } = await params;
  const { region } = await searchParams;
  const [candidate, policies] = await Promise.all([
    getCandidateById(id),
    getPolicies(),
  ]);

  if (!candidate) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-lg text-slate-500">후보자를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-slate-400 underline hover:text-slate-600"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const backHref = region?.trim() ? `/?region=${encodeURIComponent(region.trim())}` : '/';

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-10">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {region?.trim() || candidate.region} 목록으로
      </Link>

      <CandidateDetailPanel
        candidate={candidate}
      />
    </div>
  );
}

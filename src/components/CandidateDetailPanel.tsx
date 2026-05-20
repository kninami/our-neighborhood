import type { ReactNode } from 'react';
import Image from 'next/image';
import { getPartyColor, getPartyTheme } from '@/lib/partyColors';
import type { Candidate, CandidatePolicy, RegionalAgenda } from '@/types';

type Props = {
  candidate: Candidate;
  policies: CandidatePolicy[];
  agendas: RegionalAgenda[];
  compact?: boolean;
};

export default function CandidateDetailPanel({
  candidate,
  policies,
  agendas,
  compact = false,
}: Props) {
  const color = getPartyColor(candidate.party);
  const theme = getPartyTheme(candidate.party);
  const relatedPolicies = policies.filter(
    (policy) => policy.region === candidate.region && policy.candidateName === candidate.name,
  );
  const relatedAgendas = agendas.filter((agenda) => agenda.region === candidate.region);
  const links = [
    { label: '홈페이지', url: candidate.websiteUrl, tone: '#E85451' },
    { label: '페이스북', url: candidate.facebookUrl, tone: '#FEF339' },
    { label: '인스타그램', url: candidate.instagramUrl, tone: '#69BE83' },
    { label: '유튜브', url: candidate.youtubeUrl, tone: '#E85451' },
    { label: '블로그', url: candidate.blogUrl, tone: '#69BE83' },
  ].filter((link) => link.url);

  return (
    <div
      className={compact ? '' : 'rounded-[2rem]'}
      style={{ background: theme.pageBackground }}
    >
      <section className={compact ? '' : 'overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]'}>
        <div className="h-2 w-full bg-[linear-gradient(90deg,#E85451_0%,#FEF339_50%,#69BE83_100%)]" />
        <div className={`grid gap-8 px-6 py-7 sm:px-8 ${compact ? '' : 'lg:grid-cols-[1.12fr_0.88fr] lg:items-start'}`}>
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {candidate.region || '지역 미정'}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {candidate.party || '무소속'}
              </span>
            </div>

            <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-[1fr_220px] sm:items-start'}`}>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  {candidate.name}
                </h1>

                {(candidate.candidateType || candidate.district) && (
                  <p className="mt-3 text-base text-slate-600 sm:text-lg">
                    {[candidate.candidateType, candidate.district].filter(Boolean).join(' · ')}
                  </p>
                )}

                {candidate.slogan && (
                  <div
                    className="mt-6 rounded-[1.5rem] border px-5 py-4"
                    style={{ backgroundColor: theme.accentSoft, borderColor: theme.heroCardBorder }}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Slogan
                    </p>
                    <p className="mt-2 text-lg font-bold leading-relaxed text-slate-900">
                      {candidate.slogan}
                    </p>
                  </div>
                )}
              </div>

              <PhotoCard candidate={candidate} theme={theme} compact={compact} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <InfoCard label="후원 정보" accent="#E85451">
              {candidate.donationInfo || '아직 등록된 후원 정보가 없습니다.'}
            </InfoCard>
            <InfoCard label="주요 공약 수" accent="#FEF339">
              {candidate.pledges.length > 0 ? `${candidate.pledges.length}개` : '아직 등록된 공약이 없습니다.'}
            </InfoCard>
          </div>
        </div>
      </section>

      <div className={`grid gap-8 ${compact ? 'mt-6' : 'mt-8 lg:grid-cols-[1.08fr_0.92fr]'}`}>
        <div className="space-y-8">
          <SectionCard title="주요 공약" tone="#FEF339">
            {candidate.pledges.length > 0 ? (
              <ol className="grid gap-3">
                {candidate.pledges.map((pledge, index) => (
                  <li
                    key={`${candidate.id}-pledge-${index}`}
                    className="rounded-[1.25rem] border border-slate-200 px-4 py-4"
                    style={{ backgroundColor: theme.sectionSoft }}
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-700 sm:text-base">
                        {pledge}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptySection message="아직 등록된 주요 공약이 없습니다." themeSoft={theme.sectionSoft} />
            )}
          </SectionCard>

          <SectionCard title="정책 시트 추가 정보" tone="#69BE83">
            {relatedPolicies.length > 0 ? (
              <PolicyList policies={relatedPolicies} themeSoft={theme.sectionSoft} />
            ) : (
              <EmptySection message="정책 시트에 연결된 추가 설명이 아직 없습니다." themeSoft={theme.sectionSoft} />
            )}
          </SectionCard>
        </div>

        <div className="space-y-8">
          <SectionCard title="공식 채널" tone="#69BE83">
            {links.length > 0 ? (
              <ul className="grid gap-3">
                {links.map((link) => (
                  <li key={`${candidate.id}-${link.label}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-4 transition-colors hover:border-slate-400"
                      style={{ backgroundColor: 'white' }}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">{link.label}</p>
                        <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
                      </div>
                      <span
                        className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: link.tone }}
                      >
                        <svg
                          className="h-4 w-4 text-slate-950"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySection message="아직 등록된 공식 채널이 없습니다." themeSoft={theme.sectionSoft} />
            )}
          </SectionCard>

          <SectionCard title="후원 안내" tone="#E85451">
            {candidate.donationInfo ? (
              <div
                className="rounded-[1.25rem] px-4 py-4 text-sm leading-7 text-slate-700"
                style={{ backgroundColor: theme.accentSoft }}
              >
                {candidate.donationInfo}
              </div>
            ) : (
              <EmptySection message="아직 등록된 후원 정보가 없습니다." themeSoft={theme.sectionSoft} />
            )}
          </SectionCard>

          <SectionCard title="지역 현안과 의제" tone="#FEF339">
            {relatedAgendas.length > 0 ? (
              <AgendaList agendas={relatedAgendas} theme={theme} />
            ) : (
              <EmptySection message="현안과 의제 시트에 등록된 내용이 아직 없습니다." themeSoft={theme.sectionSoft} />
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function PhotoCard({
  candidate,
  theme,
  compact,
}: {
  candidate: Candidate;
  theme: ReturnType<typeof getPartyTheme>;
  compact: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border ${compact ? 'mx-auto w-full max-w-[260px]' : 'w-full'}`}
      style={{ backgroundColor: theme.heroCardBackground, borderColor: theme.heroCardBorder }}
    >
      <div className="relative aspect-[4/5]">
        {candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={`${candidate.name} 후보 사진`}
            fill
            className="object-cover"
            sizes={compact ? '260px' : '(max-width: 1024px) 260px, 220px'}
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.badgeSoft }}
            >
              <svg
                className="h-10 w-10 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a8.25 8.25 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">사진 준비 중</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              시트에 사진 URL을 추가하면 이 자리에 바로 노출됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: tone }} />
        <h2 className="text-lg font-black tracking-tight text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoCard({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      </div>
      <p className="text-sm font-medium leading-6 text-slate-700">{children}</p>
    </div>
  );
}

function PolicyList({
  policies,
  themeSoft,
}: {
  policies: CandidatePolicy[];
  themeSoft: string;
}) {
  return (
    <ul className="grid gap-3">
      {policies.map((policy, index) => (
        <li
          key={`${policy.candidateName}-${policy.title}-${index}`}
          className="rounded-[1.25rem] border border-slate-200 px-4 py-4"
          style={{ backgroundColor: themeSoft }}
        >
          <p className="text-sm font-bold text-slate-900">{policy.title || '제목 미정'}</p>
          {policy.content && (
            <p className="mt-2 text-sm leading-7 text-slate-700">{policy.content}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function AgendaList({
  agendas,
  theme,
}: {
  agendas: RegionalAgenda[];
  theme: ReturnType<typeof getPartyTheme>;
}) {
  return (
    <ul className="grid gap-3">
      {agendas.map((agenda, index) => (
        <li
          key={`${agenda.title}-${agenda.category}-${index}`}
          className="rounded-[1.25rem] border border-slate-200 px-4 py-4"
          style={{ backgroundColor: theme.sectionSoft }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {agenda.category && (
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-slate-700" style={{ backgroundColor: theme.accentSoft }}>
                {agenda.category}
              </span>
            )}
            {agenda.localArea && (
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-slate-700" style={{ backgroundColor: theme.badgeSoft }}>
                {agenda.localArea}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-900">{agenda.title || '제목 미정'}</p>
          {agenda.content && (
            <p className="mt-2 text-sm leading-7 text-slate-700">{agenda.content}</p>
          )}
          {agenda.relatedPolicy && (
            <p className="mt-3 text-xs font-medium text-slate-500">
              관련 정책: {agenda.relatedPolicy}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function EmptySection({
  message,
  themeSoft,
}: {
  message: string;
  themeSoft: string;
}) {
  return (
    <div
      className="rounded-[1.25rem] border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500"
      style={{ backgroundColor: themeSoft }}
    >
      {message}
    </div>
  );
}

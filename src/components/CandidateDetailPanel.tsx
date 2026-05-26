import type { ReactNode } from 'react';
import Image from 'next/image';
import { getPartyColor, getPartyTheme } from '@/lib/partyColors';
import type { Candidate } from '@/types';

type Props = {
  candidate: Candidate;
  compact?: boolean;
};

export default function CandidateDetailPanel({
  candidate,
  compact = false,
}: Props) {
  const color = getPartyColor(candidate.party);
  const theme = getPartyTheme(candidate.party);
  const links = [
    { label: '홈페이지', url: candidate.websiteUrl, tone: '#E73A36' },
    { label: '페이스북', url: candidate.facebookUrl, tone: '#FFED00' },
    { label: '인스타그램', url: candidate.instagramUrl, tone: '#50B62A' },
    { label: '유튜브', url: candidate.youtubeUrl, tone: '#E73A36' },
    { label: '블로그', url: candidate.blogUrl, tone: '#50B62A' },
  ].filter((link) => link.url);

  return (
    <div className={compact ? '' : 'rounded-xl'} style={{ background: theme.pageBackground }}>
      <section className={compact ? '' : 'overflow-hidden rounded-xl border border-zinc-200 bg-white'}>
        {/* 당색 배너 — 슬로건 있으면 텍스트, 없으면 컬러 스트립 */}
        {candidate.slogan ? (
          <div className="w-full px-6 py-5 sm:px-8" style={{ backgroundColor: color.bg }}>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: color.text, opacity: 0.6 }}>
              Slogan
            </p>
            <p className="text-lg font-black leading-snug sm:text-xl" style={{ color: color.text }}>
              {candidate.slogan}
            </p>
          </div>
        ) : (
          <div className="h-2 w-full" style={{ backgroundColor: color.bg }} />
        )}

        <div className={`grid gap-6 px-5 py-6 sm:px-7 ${compact ? '' : 'lg:grid-cols-[1.12fr_0.88fr] lg:items-start'}`}>
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-semibold text-zinc-600">
                {candidate.region || '지역 미정'}
              </span>
              <span
                className="rounded-md px-2.5 py-1 text-sm font-semibold"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {candidate.party || '무소속'}
              </span>
            </div>

            <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-[1fr_200px] sm:items-start'}`}>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                  {candidate.name}
                </h1>

                {(candidate.candidateType || candidate.district) && (
                  <p className="mt-2 text-base text-zinc-500 sm:text-lg">
                    {[candidate.candidateType, candidate.district].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>

              <PhotoCard candidate={candidate} theme={theme} compact={compact} />
            </div>
          </div>

          <div className="grid gap-2.5">
            <InfoCard label="후원 정보" accent="#E73A36">
              {candidate.donationInfo || '아직 등록된 후원 정보가 없습니다.'}
            </InfoCard>
          </div>
        </div>
      </section>

      <div className={`grid gap-5 ${compact ? 'mt-5 px-4 pb-5 sm:px-5 sm:pb-6' : 'mt-6 lg:grid-cols-[1.08fr_0.92fr]'}`}>
        <div className="space-y-5">
          <SectionCard title="주요 공약" tone="#FFED00">
            {candidate.pledges.length > 0 ? (
              <ol className="grid gap-2">
                {candidate.pledges.map((pledge, index) => (
                  <li
                    key={`${candidate.id}-pledge-${index}`}
                    className="rounded-lg border border-zinc-200 px-4 py-3.5"
                    style={{ backgroundColor: theme.sectionSoft }}
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-base leading-8 text-zinc-700">
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

        </div>

        <div className="space-y-5">
          <SectionCard title="공식 채널" tone="#50B62A">
            {links.length > 0 ? (
              <ul className="grid gap-2">
                {links.map((link) => (
                  <li key={`${candidate.id}-${link.label}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <div>
                        <p className="text-base font-bold text-zinc-900">{link.label}</p>
                        <p className="mt-0.5 break-all text-sm text-zinc-400">{link.url}</p>
                      </div>
                      <span
                        className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: link.tone }}
                      >
                        <svg
                          className="h-3.5 w-3.5 text-zinc-900"
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

          <SectionCard title="후원 안내" tone="#E73A36">
            {candidate.donationInfo ? (
              <div
                className="rounded-lg px-4 py-3.5 text-base leading-8 text-zinc-700 border border-zinc-200"
                style={{ backgroundColor: theme.accentSoft }}
              >
                {candidate.donationInfo}
              </div>
            ) : (
              <EmptySection message="아직 등록된 후원 정보가 없습니다." themeSoft={theme.sectionSoft} />
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
      className={`overflow-hidden rounded-xl border ${compact ? 'mx-auto w-full max-w-[240px]' : 'w-full'}`}
      style={{ backgroundColor: theme.heroCardBackground, borderColor: theme.heroCardBorder }}
    >
      <div className="relative aspect-[4/5]">
        {candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={`${candidate.name} 후보 사진`}
            fill
            className="object-cover"
            sizes={compact ? '240px' : '(max-width: 1024px) 240px, 200px'}
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.badgeSoft }}
            >
              <svg
                className="h-8 w-8 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a8.25 8.25 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-zinc-600">사진 준비 중</p>
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
    <section className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: tone }} />
        <h2 className="text-sm font-black tracking-tight text-zinc-900">{title}</h2>
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
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-sm" style={{ backgroundColor: accent }} />
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">{label}</p>
      </div>
      <p className="text-base font-medium leading-7 text-zinc-700">{children}</p>
    </div>
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
      className="rounded-lg border border-dashed border-zinc-200 px-4 py-4 text-sm text-zinc-400"
      style={{ backgroundColor: themeSoft }}
    >
      {message}
    </div>
  );
}

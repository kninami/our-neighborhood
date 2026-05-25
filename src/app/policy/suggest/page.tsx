'use client';

import { useState } from 'react';
import { submitPolicySuggestion } from './actions';

export const dynamic = 'force-dynamic';

const POLICY_AREAS = [
  '주거', '교통', '기후・환경', '에너지', '의료・복지',
  '돌봄・육아・보육', '교육', '노동・일자리', '경제', '문화・체육',
  '농업・농촌・농민・먹거리', '여성', '생명안전', '자치・민주주의',
  '인권평화', '기타',
];

export default function PolicySuggestPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [area, setArea] = useState('');
  const [areaOther, setAreaOther] = useState('');
  const [region, setRegion] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData();
    formData.set('area', area);
    formData.set('areaOther', areaOther);
    formData.set('region', region);
    formData.set('title', title);
    formData.set('description', description);

    const result = await submitPolicySuggestion(formData);
    setStatus(result.success ? 'success' : 'error');
  };

  if (status === 'success') {
    return (
      <div className="bg-zinc-50 min-h-screen">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <div className="mb-6 flex justify-center gap-2">
            {(['#E73A36', '#FFED00', '#50B62A'] as const).map((c) => (
              <span key={c} className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
            <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">정책 제안이 접수되었습니다</h1>
          <p className="mt-3 text-base text-zinc-500">소중한 의견 감사합니다. 신호등연대가 함께 검토하겠습니다.</p>
          <button
            onClick={() => {
              setStatus('idle');
              setArea('');
              setAreaOther('');
              setRegion('');
              setTitle('');
              setDescription('');
            }}
            className="mt-8 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            새 정책 제안하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="h-[3px] w-full bg-[linear-gradient(90deg,#E73A36_0%,#FFED00_50%,#50B62A_100%)]" />

          <div className="px-6 py-8 sm:px-9 sm:py-10">
            <div className="mb-7 flex items-center gap-2">
              {(['#E73A36', '#FFED00', '#50B62A'] as const).map((c) => (
                <span key={c} className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Policy Proposal</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">정책 제안하기</h1>
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              신호등연대가 담아야 할 정책을 제안해 주세요. 여러분의 아이디어가 2026 지방선거 공약이 됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-100">
            <div className="divide-y divide-zinc-100">
              {/* 정책 분야 */}
              <div className="px-6 py-6 sm:px-9">
                <label className="mb-2 block text-sm font-bold text-zinc-800" htmlFor="area">
                  정책 분야
                </label>
                <div className="relative">
                  <select
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3.5 pr-10 text-base text-zinc-800 transition-colors focus:border-zinc-400 focus:outline-none"
                  >
                    <option value="">분야를 선택해주세요</option>
                    {POLICY_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {area === '기타' && (
                  <input
                    type="text"
                    value={areaOther}
                    onChange={(e) => setAreaOther(e.target.value)}
                    placeholder="분야를 직접 입력해주세요"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-800 placeholder-zinc-300 transition-colors focus:border-zinc-400 focus:outline-none"
                  />
                )}
              </div>

              {/* 제안하는 지역 */}
              <div className="px-6 py-6 sm:px-9">
                <label className="mb-2 block text-sm font-bold text-zinc-800" htmlFor="region">
                  제안하는 지역
                  <span className="ml-1.5 text-xs font-normal text-zinc-400">ex: 경기, 강원, 충남...</span>
                </label>
                <input
                  id="region"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="지역을 입력해주세요"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-800 placeholder-zinc-300 transition-colors focus:border-zinc-400 focus:outline-none"
                />
              </div>

              {/* 정책 제목 */}
              <div className="px-6 py-6 sm:px-9">
                <label className="mb-2 flex items-center gap-1 text-sm font-bold text-zinc-800" htmlFor="title">
                  제안하는 정책명
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="정책 제목을 입력해주세요"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-800 placeholder-zinc-300 transition-colors focus:border-zinc-400 focus:outline-none"
                />
              </div>

              {/* 정책 설명 */}
              <div className="px-6 py-6 sm:px-9">
                <label className="mb-2 flex items-center gap-1 text-sm font-bold text-zinc-800" htmlFor="description">
                  정책 설명
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="정책의 필요성, 내용, 기대 효과 등을 자유롭게 작성해주세요"
                  rows={6}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base leading-7 text-zinc-800 placeholder-zinc-300 transition-colors focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 제출 */}
            <div className="border-t border-zinc-100 px-6 py-6 sm:px-9">
              {status === 'error' && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-xl bg-zinc-900 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
              >
                {status === 'submitting' ? '제출 중...' : '정책 제안 제출하기'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

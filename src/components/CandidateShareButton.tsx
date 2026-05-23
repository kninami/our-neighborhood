'use client';

import { useEffect, useState } from 'react';

type Feedback = 'idle' | 'copied' | 'shared';

type Props = {
  candidateName: string;
  audienceLabel: string;
  sharePath: string;
};

export default function CandidateShareButton({
  candidateName,
  audienceLabel,
  sharePath,
}: Props) {
  const [feedback, setFeedback] = useState<Feedback>('idle');

  useEffect(() => {
    if (feedback === 'idle') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFeedback('idle');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleShare = async () => {
    const shareUrl = new URL(sharePath, window.location.origin).toString();
    const shareData = {
      title: `${candidateName} 후보`,
      text: `${candidateName} 후보 정보를 확인해보세요.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setFeedback('shared');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setFeedback('copied');
        return;
      } catch {
        // Fall through to the prompt fallback.
      }
    }

    window.prompt('이 링크를 복사해 공유해 주세요.', shareUrl);
  };

  const buttonLabel =
    feedback === 'copied'
      ? '링크 복사됨'
      : feedback === 'shared'
        ? '공유 완료'
        : '공유하기';

  const liveMessage =
    feedback === 'copied'
      ? '후보자 모달 링크를 복사했습니다.'
      : feedback === 'shared'
        ? '후보자 모달 링크 공유를 마쳤습니다.'
        : '';

  return (
    <div className="flex items-center gap-2">
      <div className="share-tip-sway inline-flex max-w-[min(58vw,18rem)] items-center rounded-full border border-slate-200 bg-white/92 px-3 py-2 text-[11px] font-semibold leading-4 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:text-xs sm:leading-5">
        {audienceLabel} 사는 지인에게 공유해보세요
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/92 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-transform hover:-translate-y-0.5 hover:text-slate-900"
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 512 512"
          aria-hidden="true"
        >
          <path d="M503.691 189.836 327.687 37.851C312.102 24.098 288 35.235 288 56v80.1C165.2 137.8 64 252.5 64 394.7V456c0 13.255 10.745 24 24 24 6.804 0 13.285-2.859 17.821-7.871C153.206 419.067 222.899 384 288 384v80c0 20.765 24.102 31.902 39.687 18.149l176.004-151.985c10.39-9.226 10.39-25.102 0-34.328z" />
        </svg>
      </button>

      <span className="sr-only" aria-live="polite">
        {liveMessage}
      </span>
    </div>
  );
}

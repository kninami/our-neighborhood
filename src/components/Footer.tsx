export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0C0C0E' }}>
      {/* 상단 컬러 스트립 */}
      <div className="h-[3px] w-full bg-[linear-gradient(90deg,#E73A36_0%,#FFED00_50%,#50B62A_100%)]" />

      <div className="max-w-screen-xl mx-auto px-5 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {(['#E73A36', '#FFED00', '#50B62A'] as const).map((c) => (
                <span key={c} className="block rounded-sm shrink-0" style={{ width: 7, height: 7, backgroundColor: c }} />
              ))}
              <p
                className="text-base leading-none"
                style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}
              >
                우리동네 진보정치
              </p>
            </div>
            <p className="text-xs" style={{ color: '#52525B' }}>
              신호등연대 2026 지방선거 플랫폼
            </p>
          </div>

          <p
            className="text-xs sm:text-right"
            style={{ color: '#3F3F46', letterSpacing: '0.04em' }}
          >
            부자의 성장보다 모두의 존엄을
          </p>
        </div>

        <div className="mb-4" style={{ borderTop: '1px solid #1C1C1E' }} />

        <p className="text-xs" style={{ color: '#3F3F46' }}>
          © 2026 신호등연대. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

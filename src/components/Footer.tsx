export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-screen-xl mx-auto px-5 py-10">
        {/* 상단: 사이트명 (좌) + 슬로건 (우) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          {/* 사이트명 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {(['#E85451', '#FEF339', '#69BE83'] as const).map((c) => (
                <span key={c} className="block rounded-full shrink-0" style={{ width: 8, height: 8, backgroundColor: c }} />
              ))}
              <p
                className="text-lg leading-none"
                style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}
              >
                우리동네 진보정치
              </p>
            </div>
            <p className="text-xs" style={{ color: '#71717a' }}>
              신호등연대 2026 지방선거 플랫폼
            </p>
          </div>

          {/* 슬로건: 우측 끝 */}
          <p
            className="text-sm sm:text-right"
            style={{ color: '#a1a1aa', letterSpacing: '0.04em' }}
          >
            부자의 성장보다 모두의 존엄을
          </p>
        </div>

        {/* 구분선 */}
        <div className="mb-5" style={{ borderTop: '1px solid #2a2a2a' }} />

        {/* 저작권 */}
        <p className="text-xs" style={{ color: '#52525b' }}>
          © 2026 신호등연대. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const LIGHTS = [
  { color: '#E73A36' },
  { color: '#FFED00' },
  { color: '#50B62A' },
];

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    ).then((r) => r.text());

    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!url) return null;

    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fontData = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#0C0C0E',
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: fontData ? 'KR' : 'sans-serif',
        }}
      >
        {/* 왼쪽 컬러 스트립 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, backgroundColor: '#E73A36' }} />
          <div style={{ flex: 1, backgroundColor: '#FFED00' }} />
          <div style={{ flex: 1, backgroundColor: '#50B62A' }} />
        </div>

        {/* 콘텐츠 영역 */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: '64px 80px 64px 88px',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* 좌측: 텍스트 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* 배지 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 12,
                padding: '10px 18px',
                marginBottom: 44,
                width: 'fit-content',
              }}
            >
              {LIGHTS.map(({ color }) => (
                <div
                  key={color}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 3,
                    backgroundColor: color,
                  }}
                />
              ))}
              <span
                style={{
                  color: '#71717a',
                  fontSize: 20,
                  letterSpacing: '0.18em',
                  marginLeft: 8,
                }}
              >
                2026 지방선거 신호등연대
              </span>
            </div>

            {/* 타이틀 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 118,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                우리동네
              </span>
              <span
                style={{
                  color: '#a1a1aa',
                  fontSize: 118,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}
              >
                진보정치
              </span>
            </div>

            {/* 서브 텍스트 */}
            <span
              style={{
                marginTop: 48,
                color: '#3f3f46',
                fontSize: 22,
                letterSpacing: '0.06em',
              }}
            >
              신호등연대 2026 지방선거 플랫폼
            </span>
          </div>

          {/* 우측: 신호등 일러스트 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 260,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                backgroundColor: '#1A1A1E',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 28,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
                width: 210,
              }}
            >
              {/* 손잡이 */}
              <div
                style={{
                  width: 64,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }}
              />
              {/* 등 */}
              {LIGHTS.map(({ color }) => (
                <div
                  key={color}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 18,
                    backgroundColor: color,
                    boxShadow: `0 0 36px ${color}60`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'KR', data: fontData, weight: 900 as const }]
        : [],
    },
  );
}

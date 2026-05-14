import type { Metadata } from 'next';
import { Gothic_A1, Bagel_Fat_One } from 'next/font/google';
import './globals.css';

const gothicA1 = Gothic_A1({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gothic-a1',
  preload: false,
});

const bagelFatOne = Bagel_Fat_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bagel',
  preload: false,
});

export const metadata: Metadata = {
  title: '우리동네 진보정치 - 신호등연대 2026 지방선거 플랫폼',
  description:
    '2026년 지방선거 후보자와 공약을 지역별로 살펴보세요. 녹색당·정의당·노동당 후보자 정보를 제공합니다.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full ${gothicA1.variable} ${bagelFatOne.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-screen-xl mx-auto px-5 py-5 flex flex-col items-center gap-1">
            <p className="text-xs text-slate-400 leading-tight title-rise-delayed">
              부자들의 성장 대신, 모두의 존엄을
            </p>
            <h1
              className="text-3xl leading-tight title-rise"
              style={{ fontFamily: 'var(--font-bagel)', color: '#E26419' }}
            >
              우리동네 진보정치 - 신호등연대 2026 지방선거 플랫폼
            </h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

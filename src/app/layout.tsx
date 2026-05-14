import type { Metadata } from 'next';
import { Gothic_A1, Bagel_Fat_One } from 'next/font/google';
import './globals.css';
import SplashPortal from '@/components/SplashPortal';
import SearchBar from '@/components/SearchBar';
import CandidateRoller from '@/components/CandidateRoller';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import { getCandidates } from '@/lib/sheets';

const gothicA1 = Gothic_A1({
  weight: ['400', '500', '700', '900'],
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const allCandidates = await getCandidates();
  const rollingCandidates = allCandidates
    .filter(c => c.name && c.party && c.region);

  return (
    <html lang="ko" className={`h-full ${gothicA1.variable} ${bagelFatOne.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SplashPortal />
        <header className="bg-white border-b border-slate-100">
          {/*
            단일 CSS Grid 레이아웃 — 컴포넌트 중복 렌더 없이 반응형 처리
            모바일: [hamburger | roller(중앙) | spacer] / [searchbar 전체폭]
            데스크탑: [hamburger | searchbar(중앙) | roller]
          */}
          <div className="max-w-screen-xl mx-auto px-5">
            <div className="grid items-center grid-cols-[auto_1fr_auto]">
              {/* 햄버거: 항상 row1 col1 */}
              <div className="py-2 flex items-center">
                <HamburgerMenu />
              </div>

              {/* 롤러: 모바일=row1 col2 중앙 / 데스크탑=row1 col3 우측 */}
              <div className="py-2 row-start-1 col-start-2 md:col-start-3 flex items-center justify-center md:justify-end">
                <CandidateRoller candidates={rollingCandidates} />
              </div>

              {/* Spacer: 모바일 전용, 햄버거와 대칭 */}
              <div className="py-2 md:hidden row-start-1 col-start-3 w-9" aria-hidden="true" />

              {/* 검색바: 모바일=row2 전체폭 / 데스크탑=row1 col2 중앙 */}
              <div className="col-start-1 col-span-3 row-start-2 pb-2 md:col-start-2 md:col-span-1 md:row-start-1 md:py-2 flex items-center justify-center">
                <SearchBar />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

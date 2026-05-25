'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

type BaseMenuItem = {
  label: string;
  icon: ReactNode;
};

type LinkMenuItem = BaseMenuItem & {
  href: string;
  children?: never;
};

type ParentMenuItem = BaseMenuItem & {
  children: Array<{
    label: string;
    href: string;
  }>;
  href?: never;
};

type MenuItem = LinkMenuItem | ParentMenuItem;

const MENU_ITEMS: MenuItem[] = [
  {
    label: '정책 제안하기',
    href: '/policy/suggest',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    label: '사회대전환 연대회의 소개',
    children: [
      {
        label: '소개',
        href: '/coalition/about',
      },
      {
        label: '10대 공통 공약',
        href: '/coalition/pledges',
      },
      {
        label: '공동선언문',
        href: '/coalition/statement',
      },
    ],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '사회대전환 연대회의 소개': true,
  });
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function toggleSection(label: string) {
    setExpandedSections((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  function isParentItem(item: MenuItem): item is ParentMenuItem {
    return 'children' in item;
  }

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        aria-label="메뉴 열기"
        aria-expanded={open}
      >
        <span className="block w-5 h-0.5 rounded-full bg-zinc-700" />
        <span className="block w-5 h-0.5 rounded-full bg-zinc-700" />
        <span className="block w-4 h-0.5 rounded-full bg-zinc-700" />
      </button>

      {/* 백드롭 */}
      <div
        className="fixed inset-0 z-[50] transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* 드로어 */}
      <div
        className="fixed top-0 left-0 h-full z-[51] bg-white border-r border-zinc-200 flex flex-col"
        style={{
          width: 280,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="사이트 메뉴"
      >
        {/* 상단 컬러 스트립 */}
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,#E73A36_0%,#FFED00_50%,#50B62A_100%)] shrink-0" />

        {/* 드로어 헤더 */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {(['#E73A36', '#FFED00', '#50B62A'] as const).map((c) => (
                <span key={c} className="block rounded-sm" style={{ width: 8, height: 8, backgroundColor: c }} />
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700"
              aria-label="메뉴 닫기"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg leading-snug hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-gothic-a1)', fontWeight: 900, color: '#18181B', letterSpacing: '-0.03em' }}
          >
            우리동네<br />진보정치
          </Link>
          <p className="text-xs text-zinc-400 mt-1">신호등연대 2026 지방선거 플랫폼</p>
        </div>

        {/* 메뉴 항목 */}
        <nav className="flex-1 py-2 overflow-y-auto" aria-label="주요 메뉴">
          {MENU_ITEMS.map((item) => (
            <div key={item.label}>
              {isParentItem(item) ? (
                <>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-zinc-50 transition-colors"
                    onClick={() => toggleSection(item.label)}
                    aria-expanded={expandedSections[item.label] ?? false}
                  >
                    <span className="text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    <svg
                      className={`h-3.5 w-3.5 shrink-0 text-zinc-300 transition-transform duration-200 ${
                        expandedSections[item.label] ? 'rotate-90' : ''
                      }`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {(expandedSections[item.label] ?? false) && (
                    <div className="pb-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href;

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="ml-12 mr-3 flex items-center rounded-lg px-3 py-2 text-sm transition-colors"
                            style={{
                              backgroundColor: isActive ? '#FEF9C3' : 'transparent',
                              color: isActive ? '#18181B' : '#71717A',
                              fontWeight: isActive ? 700 : 500,
                            }}
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  className="group flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors font-medium flex-1">
                    {item.label}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-zinc-300 ml-auto shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

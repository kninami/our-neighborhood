'use client';

import dynamic from 'next/dynamic';

const IntroSplash = dynamic(() => import('./IntroSplash'), { ssr: false });

export default function SplashPortal() {
  return <IntroSplash />;
}

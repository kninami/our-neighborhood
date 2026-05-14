'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [query,   setQuery]   = useState('');

  return (
    <div className="relative flex items-center w-full max-w-[380px]">
      <svg
        className="absolute left-4 w-4 h-4 pointer-events-none z-10"
        style={{ color: focused ? '#111' : '#94a3b8', transition: 'color 0.15s' }}
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm outline-none transition-all"
        style={{
          backgroundColor: focused ? '#fff' : '#f1f5f9',
          border: `1.5px solid ${focused ? '#111' : 'transparent'}`,
          color: '#0f172a',
        }}
      />
    </div>
  );
}

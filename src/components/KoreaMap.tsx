'use client';

import { useState } from 'react';
import { KOREA_REGIONS } from '@/lib/koreaRegions';

type Props = {
  selectedRegion: string | null;
  regionCounts: Record<string, number>;
  onRegionSelect: (id: string | null) => void;
};

export default function KoreaMap({
  selectedRegion,
  regionCounts,
  onRegionSelect,
}: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  function getFill(id: string, isCity: boolean): string {
    if (selectedRegion === id) return '#fde8d0';
    if (hoveredRegion === id) return '#e2e8f0';
    return isCity ? '#dde4ee' : '#eef1f7';
  }

  function getStroke(id: string): string {
    if (selectedRegion === id) return '#E26419';
    if (hoveredRegion === id) return '#64748b';
    return '#b0b8c8';
  }

  function getStrokeWidth(id: string, isCity: boolean): number {
    if (selectedRegion === id) return 2;
    if (hoveredRegion === id) return 1.5;
    return isCity ? 0.8 : 1;
  }

  return (
    <svg
      viewBox="55 55 430 415"
      className="w-full h-full"
      style={{ display: 'block' }}
      aria-label="대한민국 지도"
    >
      {/* Sea / background */}
      <rect x="55" y="55" width="430" height="415" fill="#cfe8fc" />

      {KOREA_REGIONS.map(({ id, shortName, d, cx, cy, isCity }) => {
        const count = regionCounts[id] ?? 0;
        const isSelected = selectedRegion === id;
        const isHovered = hoveredRegion === id;

        return (
          <g
            key={id}
            onClick={() => onRegionSelect(isSelected ? null : id)}
            onMouseEnter={() => setHoveredRegion(id)}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={`${id} - 후보자 ${count}명`}
            aria-pressed={isSelected}
          >
            <path
              d={d}
              fill={getFill(id, isCity)}
              stroke={getStroke(id)}
              strokeWidth={getStrokeWidth(id, isCity)}
              strokeLinejoin="round"
            />

            {/* Province name */}
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isCity ? 8 : 11}
              fontWeight={isSelected || isHovered ? '700' : '500'}
              fill={isSelected ? '#b04a10' : '#334155'}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {shortName}
            </text>

            {/* Candidate count */}
            {count > 0 && (
              <text
                x={cx}
                y={cy + (isCity ? 10 : 13)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isCity ? 7 : 9}
                fill={isSelected ? '#b04a10' : '#64748b'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {count}명
              </text>
            )}
          </g>
        );
      })}

      {/* Traffic light signature dots */}
      <circle cx="462" cy="458" r="3.5" fill="#E85451" opacity="0.85" />
      <circle cx="469" cy="458" r="3.5" fill="#FEF339" opacity="0.85" />
      <circle cx="476" cy="458" r="3.5" fill="#69BE83" opacity="0.85" />
    </svg>
  );
}

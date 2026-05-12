'use client';

import { useState, useRef, useEffect } from 'react';
import { KOREA_REGIONS } from '@/lib/koreaRegions';

type Props = {
  selectedRegion: string | null;
  regionCounts: Record<string, number>;
  onRegionSelect: (id: string | null) => void;
  zoom?: number;
};

export default function KoreaMap({
  selectedRegion,
  regionCounts,
  onRegionSelect,
  zoom = 1,
}: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(null);
  const wasMovedRef = useRef(false);

  useEffect(() => {
    if (zoom <= 1) setPan({ x: 0, y: 0 });
  }, [zoom]);

  const z = zoom;
  const vbW = 430 / z;
  const vbH = 415 / z;
  const vbX = 270 - 215 / z + pan.x;
  const vbY = 262.5 - 207.5 / z + pan.y;
  const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const canPan = zoom > 1;

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (!canPan) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    wasMovedRef.current = false;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasMovedRef.current = true;
    if (!wasMovedRef.current) return;

    const rect = svgRef.current!.getBoundingClientRect();
    const scaleX = (430 / z) / rect.width;
    const scaleY = (415 / z) / rect.height;
    setPan({
      x: dragRef.current.startPanX - dx * scaleX,
      y: dragRef.current.startPanY - dy * scaleY,
    });
  }

  function handlePointerUp() {
    dragRef.current = null;
    setTimeout(() => { wasMovedRef.current = false; }, 0);
  }

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
      ref={svgRef}
      viewBox={viewBox}
      className="w-full h-full"
      style={{
        display: 'block',
        cursor: canPan ? (dragRef.current ? 'grabbing' : 'grab') : 'default',
        touchAction: canPan ? 'none' : 'auto',
      }}
      aria-label="대한민국 지도"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Sea / background */}
      <rect x="-500" y="-500" width="2000" height="2000" fill="#cfe8fc" />

      {KOREA_REGIONS.map(({ id, shortName, d, cx, cy, isCity }) => {
        const count = regionCounts[id] ?? 0;
        const isSelected = selectedRegion === id;
        const isHovered = hoveredRegion === id;

        return (
          <g
            key={id}
            onClick={() => {
              if (wasMovedRef.current) return;
              onRegionSelect(isSelected ? null : id);
            }}
            onMouseEnter={() => !dragRef.current && setHoveredRegion(id)}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: canPan ? 'inherit' : 'pointer' }}
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

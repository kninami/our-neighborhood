import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공동선언문 - 사회대전환 연대회의 소개',
  description: '2026 지방선거 신호등연대 공동선언문',
};

function parseStatement(content: string) {
  const normalized = content.replace(/^﻿/, '').replace(/\r\n/g, '\n').trim();
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const eyebrow = blocks[0] ?? '';
  const title = blocks[1] ?? '2026 지방선거 신호등연대 공동선언';
  const subtitle = blocks[2] ?? '';
  const body = blocks.slice(3);

  return { eyebrow, title, subtitle, body };
}

function isBulletBlock(block: string) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length > 1 && lines.every((line) => line.startsWith('하나,'));
}

export default async function CoalitionStatementPage() {
  const filePath = path.join(
    process.cwd(),
    '2026 지방선거 신호등연대 공동선언.txt',
  );
  const raw = await readFile(filePath, 'utf8');
  const statement = parseStatement(raw);

  return (
    <div className="bg-zinc-50">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="h-[3px] w-full bg-[linear-gradient(90deg,#E73A36_0%,#FFED00_50%,#50B62A_100%)]" />

          <div className="px-6 py-8 sm:px-9 sm:py-10">
            <div className="mb-7 flex items-center gap-2">
              {(['#E73A36', '#FFED00', '#50B62A'] as const).map((color) => (
                <span
                  key={color}
                  className="inline-flex h-3 w-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {statement.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                {statement.eyebrow}
              </p>
            )}

            <h1 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              {statement.title}
            </h1>

            {statement.subtitle && (
              <p className="mt-4 text-base font-semibold text-zinc-600 sm:text-xl">
                {statement.subtitle}
              </p>
            )}

            <div className="mt-9 space-y-4">
              {statement.body.map((block, index) => (
                isBulletBlock(block) ? (
                  <ul
                    key={`${index}-${block.slice(0, 20)}`}
                    className="space-y-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-4"
                  >
                    {block
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => (
                        <li
                          key={line}
                          className="text-sm leading-8 text-zinc-700 sm:text-base"
                        >
                          {line}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p
                    key={`${index}-${block.slice(0, 20)}`}
                    className="text-sm leading-8 text-zinc-700 sm:text-base"
                  >
                    {block}
                  </p>
                )
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

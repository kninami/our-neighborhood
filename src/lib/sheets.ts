import type { Candidate } from '@/types';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '185gMY199wwD1tVWbBgsh9M1215JRaDu9PZNlgVR3Ipg';

const REGION_ALIASES: Record<string, string> = {
  '강원도': '강원특별자치도',
  '전라북도': '전북특별자치도',
  '광주광역시': '전남광주통합특별시',
  '전라남도': '전남광주통합특별시',
};

function normalizeRegion(name: string): string {
  return REGION_ALIASES[name?.trim()] ?? name?.trim() ?? '';
}

export async function getCandidates(): Promise<Candidate[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=List&headers=1`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];

    const text = await res.text();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return [];

    const json = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    const rows: Array<{ c: Array<{ v: string | null } | null> }> =
      json?.table?.rows ?? [];

    return rows
      .map((row, i) => ({
        id: String(i),
        name: String(row.c?.[0]?.v ?? '').trim(),
        party: String(row.c?.[1]?.v ?? '').trim(),
        district: String(row.c?.[2]?.v ?? '').trim(),
        candidateType: String(row.c?.[3]?.v ?? '').trim(),
        region: normalizeRegion(String(row.c?.[4]?.v ?? '')),
      }))
      .filter((c) => c.name.length > 0);
  } catch {
    return [];
  }
}

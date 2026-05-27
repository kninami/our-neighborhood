import { cache } from 'react';
import type { Candidate, Policy, RegionalAgenda } from '@/types';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID ?? '185gMY199wwD1tVWbBgsh9M1215JRaDu9PZNlgVR3Ipg';
const GVIZ_BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;

const REGION_ALIASES: Record<string, string> = {
  '강원도': '강원특별자치도',
  '전라북도': '전북특별자치도',
  '광주광역시': '전남광주통합특별시',
  '전라남도': '전남광주통합특별시',
  '전남광주특별시': '전남광주통합특별시',
};

type GvizCell = {
  v?: string | number | boolean | null;
} | null;

type GvizRow = {
  c?: GvizCell[];
};

type GvizTable = {
  cols?: Array<unknown>;
  rows?: GvizRow[];
};

function normalizeRegion(name: string): string {
  return REGION_ALIASES[name?.trim()] ?? name?.trim() ?? '';
}

function normalizeHeader(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizePhotoUrl(value: string): string {
  const url = value.trim();
  if (!url) {
    return '';
  }

  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveFileMatch) {
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w800`;
  }

  const driveIdMatch = url.match(/[?&]id=([^&]+)/);
  if (url.includes('drive.google.com') && driveIdMatch) {
    return `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w800`;
  }

  return url;
}

function buildHeaderIndex(headers: string[]) {
  const normalized = headers.map(normalizeHeader);

  return {
    headers: normalized,
    findIndex: (...candidates: string[]) =>
      normalized.findIndex((header) => candidates.includes(header)),
    findMatchingIndexes: (matcher: (header: string) => boolean) =>
      normalized
        .map((header, index) => ({ header, index }))
        .filter((entry) => matcher(entry.header))
        .map((entry) => entry.index),
  };
}

function parseGvizTable(text: string): GvizTable | null {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');

  if (jsonStart === -1 || jsonEnd === -1) {
    return null;
  }

  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
    table?: GvizTable;
  };

  return parsed.table ?? null;
}

async function fetchSheetRows(sheet: string, range?: string): Promise<string[][]> {
  const url = new URL(GVIZ_BASE_URL);
  url.searchParams.set('tqx', 'out:json');
  url.searchParams.set('sheet', sheet);

  if (range) {
    url.searchParams.set('range', range);
  }

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }

  const table = parseGvizTable(await res.text());
  if (!table) {
    return [];
  }

  const colCount = table.cols?.length ?? 0;
  const rows = table.rows ?? [];

  return rows.map((row) =>
    Array.from({ length: colCount }, (_, index) => {
      const value = row.c?.[index]?.v;
      return value == null ? '' : String(value).trim();
    }),
  );
}

export const getCandidates = cache(async function getCandidates(): Promise<Candidate[]> {
  try {
    const rows = await fetchSheetRows('List', 'A:AZ');
    const [headerRow, ...candidateRows] = rows;
    const headerIndex = buildHeaderIndex(headerRow ?? []);
    const nameIndex = headerIndex.findIndex('후보자 이름');
    const partyIndex = headerIndex.findIndex('소속 정당');
    const districtIndex = headerIndex.findIndex('지역구');
    const candidateTypeIndex = headerIndex.findIndex('출마 유형');
    const regionIndex = headerIndex.findIndex('지역구가 속한 광역자치단체');
    const donationIndex = headerIndex.findIndex('후원정보');
    const websiteIndex = headerIndex.findIndex('홈페이지 URL');
    const facebookIndex = headerIndex.findIndex('페이스북');
    const instagramIndex = headerIndex.findIndex('인스타그램');
    const youtubeIndex = headerIndex.findIndex('유튜브');
    const blogIndex = headerIndex.findIndex('블로그');
    const sloganIndex = headerIndex.findIndex('슬로건');
    const photoIndex = headerIndex.findMatchingIndexes((header) =>
      /사진|이미지|프로필/.test(header),
    )[0] ?? -1;
    const pledgeIndexes = headerIndex.findMatchingIndexes((header) =>
      header.includes('주요공약'),
    );

    return candidateRows
      .map((row, index) => ({
        id: String(index),
        name: nameIndex >= 0 ? row[nameIndex] ?? '' : '',
        party: partyIndex >= 0 ? row[partyIndex] ?? '' : '',
        district: districtIndex >= 0 ? row[districtIndex] ?? '' : '',
        candidateType: candidateTypeIndex >= 0 ? row[candidateTypeIndex] ?? '' : '',
        region: normalizeRegion(regionIndex >= 0 ? row[regionIndex] ?? '' : ''),
        donationInfo: donationIndex >= 0 ? row[donationIndex] ?? '' : '',
        websiteUrl: websiteIndex >= 0 ? row[websiteIndex] ?? '' : '',
        facebookUrl: facebookIndex >= 0 ? row[facebookIndex] ?? '' : '',
        instagramUrl: instagramIndex >= 0 ? row[instagramIndex] ?? '' : '',
        youtubeUrl: youtubeIndex >= 0 ? row[youtubeIndex] ?? '' : '',
        blogUrl: blogIndex >= 0 ? row[blogIndex] ?? '' : '',
        slogan: sloganIndex >= 0 ? row[sloganIndex] ?? '' : '',
        pledges: pledgeIndexes
          .map((pledgeIndex) => row[pledgeIndex] ?? '')
          .filter(Boolean),
        photoUrl: normalizePhotoUrl(photoIndex >= 0 ? row[photoIndex] ?? '' : ''),
      }))
      .filter((candidate) => candidate.name.length > 0);
  } catch {
    return [];
  }
});

export const getCandidateById = cache(async function getCandidateById(id: string) {
  const candidates = await getCandidates();
  return candidates.find((candidate) => candidate.id === id) ?? null;
});

export const getPolicies = cache(async function getPolicies(): Promise<Policy[]> {
  try {
    const rows = await fetchSheetRows('정책', 'A:D');
    const [, ...policyRows] = rows;

    return policyRows
      .map((row) => ({
        party: row[0] ?? '',
        area: row[1] ?? '',
        title: row[2] ?? '',
        content: row[3] ?? '',
      }))
      .filter((policy) => policy.title || policy.content);
  } catch {
    return [];
  }
});

export const getAgendas = cache(async function getAgendas(): Promise<RegionalAgenda[]> {
  try {
    const rows = await fetchSheetRows('현안과 의제', 'A:F');
    const [, ...agendaRows] = rows;

    return agendaRows
      .map((row) => ({
        region: normalizeRegion(row[0] ?? ''),
        localArea: row[1] ?? '',
        category: row[2] ?? '',
        title: row[3] ?? '',
        content: row[4] ?? '',
        relatedPolicy: row[5] ?? '',
      }))
      .filter((agenda) => agenda.title || agenda.content || agenda.relatedPolicy);
  } catch {
    return [];
  }
});

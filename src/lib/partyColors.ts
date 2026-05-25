type PartyColor = { bg: string; text: string; border: string };
type PartyTheme = {
  pageBackground: string;
  heroCardBackground: string;
  heroCardBorder: string;
  accentSoft: string;
  sectionSoft: string;
  badgeSoft: string;
};

const PARTY_COLORS: Record<string, PartyColor> = {
  '녹색당':           { bg: '#50B62A', text: '#fff',    border: '#3d9020' },
  '정의당':           { bg: '#FFED00', text: '#1a1a1a', border: '#c9c200' },
  '노동당':           { bg: '#E73A36', text: '#fff',    border: '#b82e2b' },
  '기본소득당':       { bg: '#50B62A', text: '#fff',    border: '#3d9020' },
  '사회변혁노동자당': { bg: '#E73A36', text: '#fff',    border: '#b82e2b' },
  '진보당':           { bg: '#E73A36', text: '#fff',    border: '#b82e2b' },
  '미래당':           { bg: '#FFED00', text: '#1a1a1a', border: '#c9c200' },
  '사회당':           { bg: '#E73A36', text: '#fff',    border: '#b82e2b' },
  '탈시설장애인당':   { bg: '#F9602B', text: '#fff',    border: '#d44a1f' },
};

const DEFAULT_COLOR: PartyColor = { bg: '#94a3b8', text: '#fff', border: '#64748b' };
const DEFAULT_THEME: PartyTheme = {
  pageBackground: 'linear-gradient(180deg,#f8fafc 0%,#ffffff 24%,#f8fafc 100%)',
  heroCardBackground: '#ffffff',
  heroCardBorder: '#e2e8f0',
  accentSoft: '#f8fafc',
  sectionSoft: '#f8fafc',
  badgeSoft: '#f1f5f9',
};

const PARTY_THEMES: Record<string, PartyTheme> = {
  '정의당': {
    pageBackground: 'linear-gradient(180deg,#fffbe0 0%,#ffffff 24%,#fffef0 100%)',
    heroCardBackground: '#fffbe0',
    heroCardBorder: '#f0e000',
    accentSoft: '#fffce8',
    sectionSoft: '#fffdf0',
    badgeSoft: '#fff8b0',
  },
  '녹색당': {
    pageBackground: 'linear-gradient(180deg,#e6f7dc 0%,#ffffff 24%,#f2faea 100%)',
    heroCardBackground: '#edf7e4',
    heroCardBorder: '#8dd468',
    accentSoft: '#e8f6de',
    sectionSoft: '#f0f9e8',
    badgeSoft: '#d4edbe',
  },
  '노동당': {
    pageBackground: 'linear-gradient(180deg,#ffeeed 0%,#ffffff 24%,#fff6f5 100%)',
    heroCardBackground: '#fff4f3',
    heroCardBorder: '#f09a97',
    accentSoft: '#fff2f1',
    sectionSoft: '#fff7f6',
    badgeSoft: '#ffd8d6',
  },
  '탈시설장애인당': {
    pageBackground: 'linear-gradient(180deg,#fff0ea 0%,#ffffff 24%,#fff5f0 100%)',
    heroCardBackground: '#fff3ed',
    heroCardBorder: '#f9a882',
    accentSoft: '#fff1eb',
    sectionSoft: '#fff6f2',
    badgeSoft: '#fdd5c0',
  },
};

export function getPartyColor(party: string): PartyColor {
  return PARTY_COLORS[party] ?? DEFAULT_COLOR;
}

export function getPartyTheme(party: string): PartyTheme {
  return PARTY_THEMES[party.trim()] ?? DEFAULT_THEME;
}

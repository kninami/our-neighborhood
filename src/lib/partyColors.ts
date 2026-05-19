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
  '녹색당': { bg: '#69BE83', text: '#fff', border: '#4da06a' },
  '정의당': { bg: '#FEF339', text: '#1a1a1a', border: '#d4c700' },
  '노동당': { bg: '#E85451', text: '#fff', border: '#c43b38' },
  '기본소득당': { bg: '#69BE83', text: '#fff', border: '#4da06a' },
  '사회변혁노동자당': { bg: '#E85451', text: '#fff', border: '#c43b38' },
  '진보당': { bg: '#E85451', text: '#fff', border: '#c43b38' },
  '미래당': { bg: '#FEF339', text: '#1a1a1a', border: '#d4c700' },
  '사회당': { bg: '#E85451', text: '#fff', border: '#c43b38' },
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
    pageBackground: 'linear-gradient(180deg,#fff9dd 0%,#ffffff 24%,#fffef4 100%)',
    heroCardBackground: '#fffbea',
    heroCardBorder: '#f4e67a',
    accentSoft: '#fffde2',
    sectionSoft: '#fffbef',
    badgeSoft: '#fff6bf',
  },
  '녹색당': {
    pageBackground: 'linear-gradient(180deg,#e8f7ee 0%,#ffffff 24%,#f5fcf7 100%)',
    heroCardBackground: '#f2fbf5',
    heroCardBorder: '#9bd4ad',
    accentSoft: '#eefaf1',
    sectionSoft: '#f4fcf6',
    badgeSoft: '#dff3e6',
  },
  '노동당': {
    pageBackground: 'linear-gradient(180deg,#fff0ef 0%,#ffffff 24%,#fff7f6 100%)',
    heroCardBackground: '#fff6f5',
    heroCardBorder: '#f1a7a5',
    accentSoft: '#fff4f3',
    sectionSoft: '#fff8f7',
    badgeSoft: '#ffe0df',
  },
};

export function getPartyColor(party: string): PartyColor {
  return PARTY_COLORS[party] ?? DEFAULT_COLOR;
}

export function getPartyTheme(party: string): PartyTheme {
  return PARTY_THEMES[party.trim()] ?? DEFAULT_THEME;
}

type PartyColor = { bg: string; text: string; border: string };

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

export function getPartyColor(party: string): PartyColor {
  return PARTY_COLORS[party] ?? DEFAULT_COLOR;
}

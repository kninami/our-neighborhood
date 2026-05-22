const REGION_SHORT_NAMES: Record<string, string> = {
  서울특별시: '서울',
  부산광역시: '부산',
  대구광역시: '대구',
  인천광역시: '인천',
  광주광역시: '광주',
  대전광역시: '대전',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원도: '강원',
  강원특별자치도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전라북도: '전북',
  전북특별자치도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
};

export function getRegionShortName(region: string): string {
  const normalized = region.trim();

  return REGION_SHORT_NAMES[normalized] ?? normalized;
}

export function stripElectionDistrict(value: string): string {
  return value
    .replace(/\s*제\s*\d+\s*선거구/gu, '')
    .replace(/\s*선거구/gu, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildLocationLabel(region: string, district: string): string {
  const regionShort = getRegionShortName(region);
  const districtLabel = stripElectionDistrict(district)
    .split(/[·,/]/)[0]
    ?.trim() || '';

  if (!districtLabel) {
    return regionShort || '이 지역';
  }

  if (!regionShort) {
    return districtLabel;
  }

  if (districtLabel.startsWith(regionShort)) {
    return districtLabel;
  }

  return `${regionShort} ${districtLabel}`.replace(/\s+/g, ' ').trim();
}

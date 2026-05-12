import { getCandidates } from '@/lib/sheets';
import MapPage from '@/components/MapPage';

export default async function Home() {
  const candidates = await getCandidates();

  return <MapPage candidates={candidates} />;
}

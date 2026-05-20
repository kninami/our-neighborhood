import { getAgendas, getCandidates, getPolicies } from '@/lib/sheets';
import MapPage from '@/components/MapPage';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; candidate?: string }>;
}) {
  const [candidates, policies, agendas] = await Promise.all([
    getCandidates(),
    getPolicies(),
    getAgendas(),
  ]);
  const { region, candidate } = await searchParams;

  return (
    <MapPage
      candidates={candidates}
      policies={policies}
      agendas={agendas}
      initialRegion={region?.trim() || null}
      initialCandidateId={candidate?.trim() || null}
    />
  );
}

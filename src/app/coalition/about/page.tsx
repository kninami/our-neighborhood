import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 - 사회대전환 연대회의',
  description: '사회대개혁과 체제전환, 평등한 세상의 노동 정치를 의제로 함께하는 진보 연대체',
};

const PARTICIPATING_UNITS = [
  '노동당',
  '녹색당',
  '정의당',
  '노동·정치·사람(노정사)',
  '노동자계급정당건설추진준비위원회(노정추)',
  '노동해방을위한좌파활동가전국결집(전국결집)',
  '노동자가여는평등의길(평등의길)',
  '노동전선',
  '탄핵너머연구자네트워크',
  '플랫폼C',
  '민주노총 서울본부',
  '공공운수노조',
  '금속노조',
];

export default function CoalitionAboutPage() {
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

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              About
            </p>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              사회대전환 연대회의 소개
            </h1>

            <div className="mt-8 space-y-5">
              <p className="text-sm leading-8 text-zinc-700 sm:text-base">
                보수양당이 담지 못하는 광장의 목소리 — 사회대개혁과 체제전환, 평등한 세상의 노동 정치를 의제로 독자적 진보정치의 세력화가 필요하다는데 공감하는 진보정당과 시민사회·노동운동 조직들이 함께 결성한 연대체입니다.
              </p>
              <p className="text-sm leading-8 text-zinc-700 sm:text-base">
                지난 비상계엄·윤석열 파면 투쟁을 함께했고, 21대 대선에 공동 경선을 치르고 후보를 선출하여 함께 대응하였습니다.
              </p>
            </div>

            <div className="mt-10">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: '#FFED00' }} />
                <h2 className="text-sm font-black tracking-tight text-zinc-900">참여단위</h2>
              </div>
              <p className="text-sm leading-8 text-zinc-700 sm:text-base">
                {PARTICIPATING_UNITS.join(', ')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

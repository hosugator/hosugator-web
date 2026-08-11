'use client';

import { projectsData } from '@/data/projectsData';
import { projectsDataEn } from '@/data/projectsData.en';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { shortNameOf, slugify } from '@/lib/projects';
import { useSectionView } from '@/hooks/useSectionView';

// 진행 중(현재) 프로젝트 — 최상단 고정 노출 (배열 순서대로)
// NOTE 이 배열은 "진행 중" 표시(accent 점)와 루트 정렬 순서를 겸한다.
//   자식 프로젝트(PARENT에 등재된 것)는 루트 정렬에서 제외되므로,
//   여기 등재해도 순서에는 영향이 없고 점만 붙는다.
const CURRENT = ['Edge AI LMR', 'V1-AOI', 'AlignAI', 'go2fit', 'Hosugator'];
// 프로젝트 연도 (정렬·표시용). 필요 시 여기만 수정.
const YEAR: Record<string, string> = {
  'AlignAI': '2026', 'Edge AI LMR': '2026', 'ERP Backup': '2026', 'Hosugator': '2026',
  'go2fit': '2026', 'V1-AOI': '2026',
  'Dotodo': '2025', 'Sodamdiary': '2025', 'Pictag': '2025', 'Cureat': '2025',
  'Dorosee': '2025', 'KDLC': '2025',
};

// 프로젝트 계층 — 자식은 부모 바로 아래에 들여쓰기로 붙는다. { 자식: 부모 }
//
// WHY 별도 카드를 유지하면서 계층을 주나:
//   V1-AOI는 Edge AI LMR과 같은 Factory OS의 비전 워크스트림이라 종속 관계가 사실이다.
//   동시에 ADR-020이 "공정 모델(M1~M3)은 범위 밖, V1-AOI 단독 패키지 전제"로 납품 경계를
//   잘라둔 독립 산출물이기도 하다.
//   완전 병합하면 비지도 이상탐지라는 별개 역량이 구현 카드 한 줄로 뭉개지고,
//   완전 분리하면 한 프로젝트를 둘로 쪼개 분량을 늘린 것처럼 읽힌다.
//   계층 표현이 둘 다 해결한다 — 종속성을 드러내면서 살아있는 산출물로 남긴다.
const PARENT: Record<string, string> = { 'V1-AOI': 'Edge AI LMR' };

// 데모 모달을 가진 프로젝트 — 목록에서 바로 진입 가능한 버튼을 붙인다.
// 라벨은 "Live demo"가 아니라 "Demo"다: v1-aoi는 사전 계산 결과를 보여주는 정적 데모라
// "Live"가 사실과 다르다. 데모별로 라벨을 다르게 두면 버튼을 못 찾으므로 문구를 통일했다.
// cureat은 2026-08-03 제외 — 백엔드가 스텁 응답을 반환해 카드의 주장("광고성 콘텐츠
// 20%+ 제거")을 데모가 반증하는 상태다. 상세 근거는 ProjectDetail.tsx 주석 참고.
const DEMO_SLUGS = new Set(["alignai", "v1-aoi"]);

export default function Projects() {
  const { locale } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useSectionView('projects');

  // 기존 딥링크(?demo=cureat) 보존 → 해당 프로젝트 상세로 이동
  useEffect(() => {
    if (searchParams.get('demo') === 'cureat') router.push('/projects/cureat');
  }, [searchParams, router]);

  const currentData = locale === 'en' ? projectsDataEn : projectsData;

  // 자식은 정렬 대상에서 빼둔다 — 부모 위치가 확정된 뒤 그 바로 아래로 삽입하기 때문.
  // WHY: 자식을 같이 정렬하면 CURRENT/YEAR를 나중에 손볼 때 부모-자식 인접이 조용히 깨진다.
  const isChild = (name: string) => name in PARENT;
  const children = currentData.items.filter((p) => isChild(shortNameOf(p.title)));

  // 진행 중 프로젝트를 최상단에, 나머지는 시간순(최신 우선)
  const roots = currentData.items
    .filter((p) => !isChild(shortNameOf(p.title)))
    .sort((a, b) => {
      const an = shortNameOf(a.title), bn = shortNameOf(b.title);
      const ai = CURRENT.indexOf(an), bi = CURRENT.indexOf(bn);
      if (ai !== -1 || bi !== -1) {
        if (ai !== -1 && bi !== -1) return ai - bi;
        return ai !== -1 ? -1 : 1;
      }
      return (YEAR[bn] || '').localeCompare(YEAR[an] || '');
    });

  // 루트 뒤에 자기 자식을 이어 붙여 평탄화. depth가 렌더의 들여쓰기 단서가 된다.
  const items = roots.flatMap((root) => [
    { project: root, depth: 0 },
    ...children
      .filter((c) => PARENT[shortNameOf(c.title)] === shortNameOf(root.title))
      .map((c) => ({ project: c, depth: 1 })),
  ]);

  // WHY ref가 항상 렌더되는 <section>에 있어야 하나:
  //   예전엔 `if (!mounted) return <section ...></section>` 식으로 마운트 전/후 서로 다른
  //   엘리먼트를 리턴해서, ref(=IntersectionObserver 관찰 대상)가 마운트 시점에 통째로
  //   교체됐다. 관찰이 늦게 시작되는 그 틈에 이미 스크롤을 지나친 방문자는 "들어오는 순간"을
  //   놓쳐 section-view 이벤트가 아예 안 잡혔다(Insights는 이 게이트가 없어서 정상 작동).
  //   그래서 <section ref={sectionRef}>는 항상 같은 자리에 렌더하고, mounted 게이트는
  //   그 안쪽 콘텐츠에만 걸어 관찰 대상 자체는 최초 페인트부터 안정적으로 유지한다.
  return (
    <section id="projects" ref={sectionRef} className="border-t border-neutral-100 py-24 text-neutral-900">
      {mounted && (
        <>
      <div className="mb-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-900 mb-4">
          OUTPUT
        </h2>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-neutral-900 whitespace-pre-line">
          {currentData.title}
        </h3>
      </div>

      {/* 시간순 리스트 — 행 클릭 시 프로젝트 상세로 이동 */}
      <div className="border-t border-neutral-200">
        {items.map(({ project, depth }) => {
          const name = shortNameOf(project.title);
          const year = YEAR[name] || '';
          const isCurrent = CURRENT.includes(name);
          const slug = slugify(project.title);
          const hasDemo = DEMO_SLUGS.has(slug);
          const parent = PARENT[name];
          return (
            <div
              key={project.title}
              className="group flex items-center gap-4 sm:gap-6 py-4 border-b border-neutral-200"
            >
              <a href={`/projects/${slug}`} className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                <span className="font-mono text-xs text-neutral-300 w-10 shrink-0">{year}</span>
                {depth > 0 && (
                  // 트리 커넥터 — 들여쓰기와 종속 관계를 동시에 표현한다.
                  // 시각 단서(들여쓰기)는 스크린리더에 전달되지 않으므로 sr-only로 관계를 따로 읽어준다.
                  <>
                    <span className="font-mono text-sm text-neutral-300 shrink-0" aria-hidden>
                      └
                    </span>
                    <span className="sr-only">{parent} 하위 프로젝트: </span>
                  </>
                )}
                <span className="flex items-center gap-2 shrink-0">
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-accent" title="In progress" aria-hidden />}
                  <span className="font-black text-neutral-900 group-hover:text-accent transition-colors">{name}</span>
                </span>
                <span className="flex-1 min-w-0 text-sm font-light text-neutral-400 truncate hidden sm:block">{project.desc}</span>
              </a>
              {hasDemo ? (
                <a
                  href={`/projects/${slug}?demo=1`}
                  data-goatcounter-click={`projects-list-demo/${slug}`}
                  data-goatcounter-title={`${name} demo`}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-accent/90 transition-colors"
                >
                  Demo <ArrowRight size={12} />
                </a>
              ) : (
                <ArrowRight
                  size={16}
                  className="ml-auto shrink-0 text-neutral-300 group-hover:text-accent group-hover:translate-x-1 transition-all"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </section>
  );
}

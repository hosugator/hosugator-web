// app/r/[company]/page.tsx → 빌드 시 /r/{slug}/index.html 생성
//
// 목적은 "페이지를 보여주는 것"이 아니라 "로그에 남는 고유 주소를 만드는 것"이다.
// CloudFront(OAC) 뒤의 S3 액세스 로그에는 방문자 IP·User-Agent 가 남지 않는다
// (요청자가 svc:cloudfront.amazonaws.com 으로만 찍힌다). 남는 것은 경로뿐이라,
// 경로 자체를 식별자로 쓴다 — 이 URL 을 아는 것은 그 이력서를 받은 쪽뿐이다.
//
// 전제: CloudFront 「동작」에 /r/* 을 CachingDisabled 로 두어야 매 요청이 S3 까지 온다.
// 캐시가 걸리면 첫 요청만 로그에 남고 재방문이 묻힌다.

import type { Metadata } from 'next';
import { outreachSlugs, findOutreach } from '@/lib/outreach';

// ── 채울 곳: 도착지 ───────────────────────────────────────────────────────
// 홈('/')이 기본이다. /resume 로 바로 보낼 수도 있는데, 그러면 이력서를 이미 본
// 사람에게 같은 문서를 다시 보여주는 셈이라 홈이 자연스럽다.
const REDIRECT_TO = '/';

// WHY 필요한가 — output: 'export' 는 서버가 없어서 요청 시점에 경로를 만들 수 없다.
// 빌드 때 생성할 목록을 여기서 확정한다.
export function generateStaticParams() {
  return outreachSlugs().map((company) => ({ company }));
}

// WHY noindex 인가 — 이 경로가 검색에 잡히면 크롤러 요청이 로그에 섞여
// "사람이 열었다"는 신호가 오염된다. robots.txt 의 Disallow 와 이중으로 막는다
// (robots.txt 는 크롤링을, noindex 는 색인을 막아 역할이 다르다).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const outreach = findOutreach(company);

  // WHY meta refresh 인가 — 정적 내보내기라 서버 리다이렉트(3xx)를 쓸 수 없고,
  // 클라이언트 라우팅은 JS 가 막히면 빈 화면이 남는다. meta refresh 는 JS 없이 동작한다.
  // React 19 는 컴포넌트가 렌더한 <meta> 를 <head> 로 끌어올리므로 여기 그냥 두면 된다.
  //
  // WHY 랜딩 페이지가 아닌가 — 기본 이력서로 내는 건도 있어서 회사별 인사말을 두면
  // 그쪽이 어색해진다. 도착 동작을 하나로 유지한다.
  //
  // 관측에는 영향이 없다 — 요청이 S3 에 도달한 시점에 이미 로그가 남으므로
  // 그 뒤 리다이렉트를 하든 말든 기록은 동일하다.
  return (
    <>
      {/* 지연 0 인 meta refresh 는 브라우저가 리다이렉트로 취급해 히스토리를 「대체」한다 —
          Chromium 에서 도착 후 뒤로 가기를 눌러보니 이 경로로 돌아오지 않았다(2026-08-19 실측).
          그래서 JS 의 location.replace 를 덧댈 필요가 없다. 덧대려 해도 안 된다:
          React 19 는 <meta> 만 head 로 올리고 인라인 <script> 는 body 에 남기므로
          head 의 refresh 가 먼저 발동해 script 가 실행되지 못한다. */}
      <meta httpEquiv="refresh" content={`0; url=${REDIRECT_TO}`} />
      <main>
        {/* meta refresh 가 막힌 환경(드묾)을 위한 폴백. 정상 동작에서는 스치거나 안 보인다.
            라벨에 호스트명을 박지 않는다 — href 가 상대 경로여서 로컬에서는 localhost 로 가는데
            "hosugator.com 으로 이동"이라고 쓰면 텍스트와 동작이 어긋난다.
            상대 경로를 쓰는 이유는 로컬 빌드를 그대로 검증할 수 있기 때문이다 —
            절대 URL 을 박으면 테스트할 때마다 프로덕션으로 튕겨 확인이 불가능해진다. */}
        <p>
          자동으로 이동하지 않으면 <a href={REDIRECT_TO}>여기를 누르세요</a>.
        </p>
        {/* outreach 는 지금 쓰지 않지만 남겨둔다 — 나중에 회사별로 도착지를 다르게
            보내고 싶어지면(예: 로봇 회사는 /projects/edge-ai-lmr) 여기서 갈린다 */}
        {outreach ? null : null}
      </main>
    </>
  );
}

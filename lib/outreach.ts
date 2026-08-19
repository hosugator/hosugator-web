// lib/outreach.ts — 이력서에 넣는 추적용 경로(/r/{slug})의 원장(原帳)
//
// WHY 이 파일이 따로 있나
//   경로 목록이 곧 "언제 어디에 이력서를 냈나"의 기록이 된다. 코드에 두면 git 이력이
//   그 타임라인을 대신 남긴다 — 별도 스프레드시트를 만들지 않아도 되는 이유다.
//
// WHY 목록을 손으로 관리하나
//   output: 'export' 는 빌드 시점에 생성할 경로를 전부 알아야 한다(서버가 없으므로
//   요청이 와도 그때 만들어줄 주체가 없다). 그래서 generateStaticParams 가 이 배열을
//   읽어 /r/{slug}/index.html 을 미리 찍어낸다. 여기 없는 slug 는 404 가 된다.

export type Outreach = {
  /** URL 에 들어갈 식별자. 소문자·하이픈만. 한 번 뿌리면 바꾸지 않는다 */
  slug: string;
  /** 회사명 — 페이지에 노출할지는 page.tsx 에서 정한다 */
  company: string;
  /** 지원일 YYYY-MM-DD. 로그의 요청 시각과 대조해 "며칠 만에 열렸나"를 본다 */
  appliedAt: string;
  /** 직무명 — 같은 회사에 여러 번 낼 때 구분용 */
  role?: string;
};

// 주의: 이 배열이 비면 빌드가 실패한다. Next 16 은 그때 "generateStaticParams() 가
// 없다"는 부정확한 메시지를 내므로 함수를 찾아 헤매게 된다 — 함수는 있고 목록이 빈
// 것이다(2026-08-19 실측). 그래서 최소 한 항목은 항상 유지한다.
export const outreaches: Outreach[] = [
  // 기본 이력서(회사 무관)에 넣는 링크. 특정 지원이 아니라 계속 재사용하므로
  // appliedAt 은 「이 링크를 뿌리기 시작한 날」로 읽는다.
  // slug 를 'resume' 로 두지 않는다 — 사이트에 이미 /resume 페이지가 있어서
  // /r/resume 와 /resume 가 대화·로그에서 계속 엉킨다(실제로 겪었다).
  { slug: 'base', company: '(기본 이력서)', appliedAt: '2026-08-19' },

  // ── 채울 곳 1 ─────────────────────────────────────────────────────────
  // 지원할 때마다 한 줄씩 추가한다. 예:
  // { slug: 'makinarocks', company: '마키나락스', appliedAt: '2026-08-14', role: 'FDE - Vision' },
  //
  // slug 를 회사명 그대로 쓸지(makinarocks) 무의미한 문자열로 쓸지(a7f3)는 판단이 갈린다.
  //   - 회사명: 나중에 로그를 읽을 때 바로 알아본다. 대신 URL 을 본 사람이 용도를 눈치챈다
  //   - 무의미: 용도가 안 드러난다. 대신 이 파일 없이는 로그를 해석할 수 없다
  // 어느 쪽이든 이 파일이 대조표 역할을 하므로 기능상 차이는 없다.
];

export function outreachSlugs(): string[] {
  return outreaches.map((o) => o.slug);
}

export function findOutreach(slug: string): Outreach | undefined {
  return outreaches.find((o) => o.slug === slug);
}

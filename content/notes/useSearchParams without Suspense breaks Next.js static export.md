---
created: 2026-07-09
updated: 2026-07-09
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - nextjs
  - ssg
  - suspense
  - ci-cd
publish: true
---
## Context
hosugator-web에 align-ai 데모(샘플 이미지 선택 UI)를 추가한 뒤 이 변경을 처음으로 GitHub Actions CI(`next build`)에 태웠는데, `/projects/[slug]` 프리렌더가 실패했다.
원인은 이번에 새로 만든 코드가 아니라 이전부터 있던 `ProjectDetail.tsx`의 `?demo=1` 자동 오픈 로직(`useSearchParams()`)이었다. 로컬 `next dev`에서는 문제없이 동작해서 여태 발견되지 않은 채 커밋에 섞여 있었다.

## Insight
- `useSearchParams()`는 클라이언트 전용 값이라, `generateStaticParams`로 프리렌더되는 SSG 페이지에서 `<Suspense>` 없이 쓰면 `next build`가 `missing-suspense-with-csr-bailout` 에러로 실패한다.
- `next dev`(Turbopack dev 서버)는 이 검사를 하지 않는다. 즉 **로컬 개발 서버 테스트만으로는 이 버그를 잡을 수 없고, 실제 프로덕션 빌드(`next build`)를 CI에서 한 번은 반드시 태워봐야** 드러난다.
- 이 저장소 `app/page.tsx`는 이미 `Projects` 컴포넌트(동일하게 `useSearchParams` 사용)를 `<Suspense fallback=...>`로 감싸둔 선례가 있었다 — 새 SSG 라우트에 클라이언트 훅을 노출할 때는 그 패턴을 그대로 복제하면 된다.

## Decision

`/projects/[slug]/page.tsx`에서 `<ProjectDetail>`을 `<Suspense fallback={<div>Loading...</div>}>`로 감쌌다. `dynamic = 'force-dynamic'`으로 SSG를 포기하는 대안은 고려하지 않음 — 이 프로젝트의 배포 방식(S3+CloudFront 정적 export)과 맞지 않기 때문. 앞으로 새 페이지에 `useSearchParams`/`useRouter` 등 클라이언트 훅을 추가할 때는 처음부터 Suspense로 감싸는 걸 기본값으로 삼는다.

## Related

- [[CloudFront Function resolves sub-route AccessDenied on S3 static sites]] — 같은 S3+CloudFront 정적 배포 파이프라인에서 겪은 또 다른 라우팅 이슈
- [[SSG]]
- [[hosugator - infra - align-ai demo deploy log]] — 같은 세션에서 진행 중인 align-ai 데모 작업 로그

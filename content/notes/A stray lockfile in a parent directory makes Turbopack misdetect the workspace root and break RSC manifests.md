---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[Next.js]]"
project: "[[Hosugator Web]]"
tags:
  - nextjs
  - turbopack
  - monorepo
  - build
publish: true
---
## Context
hosugator-web(Next.js 16, Turbopack)에서 RSC manifest가 깨지는 원인 불명의 빌드 문제가 있었다. 
홈 디렉토리 상위 어딘가에 남아있던 떠돌이 lockfile(다른 프로젝트의 흔적)이 원인이었다 — Turbopack이 워크스페이스 루트를 추론할 때 가장 가까운 lockfile을 기준으로 삼는데, 그게 실제 프로젝트 루트가 아닌 상위 디렉토리를 가리켰다.

## Insight
### Turbopack의 워크스페이스 루트 추론은 lockfile 위치 기반이라 무관한 상위 디렉토리에 낚일 수 있다

모노레포가 아닌 단일 프로젝트에서도, 홈 디렉토리나 상위 경로에 다른 프로젝트의 lockfile이 남아있으면 Turbopack이 그걸 워크스페이스 루트로 잘못 추론한다.
이 오추론은 조용히 일어나서 증상(RSC manifest 깨짐)만 보고는 원인을 찾기 어렵다.

## Decision
`next.config.ts`의 `turbopack.root`를 `__dirname`(설정 파일 위치, 곧 실제 프로젝트 루트)으로 명시 고정했다 — 자동 추론에 맡기는 대신 명시적으로 못박는 쪽을 택함.
이유는 떠돌이 lockfile은 언제든 다시 생길 수 있어 근본 원인(lockfile 정리)보다 결과(루트 고정)를 고치는 게 재발 방지에 더 안정적이기 때문.
- 전환 조건: 실제로 모노레포 구조로 전환해 여러 워크스페이스 루트를 의도적으로 다뤄야 할 때 재검토.

## Related
- [[Next.js App Router maps folder structure to URLs and file names to component roles]] — 같은 프로젝트의 라우팅 컨벤션
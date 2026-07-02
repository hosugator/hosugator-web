---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - para
  - pcloud
  - file-management
publish: true
---
## Context
pCloud를 번호 체계(00. old / 01. life / 02. knowledge / 03. career / 04. project)로 관리해왔다. 
git 레포 문서 아키텍처, zettelkasten, pCloud 3가지 저장소가 각각 다른 원칙으로 운영되어 SSOT가 불명확했다.
pCloud의 역할을 "git으로 추적되지 않는 개인 비프로젝트 콘텐츠의 SSOT"로 재정의하면서 구조 재편이 필요해졌다.

## Decision
PARA (Projects / Areas / Resources / Archive / Inbox) 아키텍처 적용.

**핵심 판단:**
- `areas`는 현재 활성 상태인 책임만 유지. 비활성 항목은 무조건 archive.
- `archive` 내부 depth는 제한 없음 — 검색 접근 공간이므로 탐색 구조 불필요.
- git(코드/마크다운) · pCloud(개인 바이너리/비프로젝트) · zettelkasten(통찰/결정 로그) 3가지 저장소의 관심사 분리 확립.

**이동 결과:**
- `areas/life/finance, events, media, documents` → `archive/life/`
- `areas/career/asset` 내 구버전(00. old, resume/archive) → `archive/career/asset/`
- `areas`에 남은 것: `life/pet`, `life/photos`, `life/screenshots`, `career/dtk`, `career/asset`

## Consequences
- 루트 탐색이 5개 폴더(projects/areas/resources/archive/inbox)로 단순화
- 번호 체계 제거로 새 항목 추가 시 순서 고민 불필요
- areas가 얕아져 browse 비용 감소
- archive는 그대로 던지므로 내부가 이전 구조 혼재 — 검색 의존

## Related
- [[PARA archive has no depth constraint because retrieval is by search not navigation]]

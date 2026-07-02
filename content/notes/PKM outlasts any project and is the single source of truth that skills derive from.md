---
created: 2026-05-26
updated: 2026-05-26
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - pkm
  - ssot
  - knowledge-management
  - system-design
publish: true
---

## Context

PKM 스킬(`pkm-management`, `repo-doc-management`)을 업데이트하면서 발생한 통찰. ADR 노트와 insight 노트가 같은 내용을 다룰 때 어느 쪽이 SSOT인지, 스킬과 PKM 중 어느 쪽을 먼저 업데이트해야 하는지를 논의하다가 도출됐다.

## Insight

### 프로젝트 레포는 한시적이고 PKM은 영속적이다

프로젝트 레포는 프로젝트가 끝나면 아카이브된다. 스킬 파일도 dotfiles에 있지만 재설치·마이그레이션 시 재구성 대상이다. PKM vault는 어느 회사에 있든, 어떤 기기를 쓰든 항상 들고 다니는 개인 지식 기반이다.

따라서 **지식의 권위는 PKM에 있고, 스킬과 프로젝트 컨벤션은 PKM에서 파생된다.**

### 업데이트 방향은 PKM → 스킬 → 프로젝트 레포 순이다

```
PKM (원천)
  → 스킬 (PKM 원칙을 도구화)
    → 프로젝트 레포 (스킬을 적용한 구현)
```

반대 방향(프로젝트에서 발견한 것을 스킬에만 반영)은 PKM이 stale해지는 원인이다.

### PKM의 subject + project 프론트매터가 이미 이중 역할을 지원한다

- `subject`: 지식 도메인 (프로젝트 독립적, 재사용 가능)
- `project`: 이 지식이 최초로 발현된 프로젝트 맥락

별도 insight 노트와 ADR 노트로 분리하지 않아도, 단일 노트가 두 역할을 모두 수행할 수 있다. 결정에서 도출된 원리는 ADR에 Rationale 섹션으로 통합하는 것이 SSOT를 유지하는 방법이다.

## Related

- [[3-tier document architecture satisfy SSOT, audit-trail, and cooperation]] — 스킬/레포의 3계층이 PKM 원칙에서 파생된 사례
- [[pkm-역할-재정의]] — PKM의 역할 변화 맥락
- [[Old PKM protocol blocked practical learning from being stored]] — 과도한 분리 원칙이 오히려 PKM을 stale하게 만든 사례

---
created: 2026-05-25
updated: 2026-05-25
type: insight
status: 2-stable
subject: "[[Web]]"
project: "[[Hosugator Web]]"
tags:
  - hosugator
  - blog
  - insights
  - nextjs
  - architecture
publish: true
---

## Context

홈의 Knowledge 그래프 섹션은 메인 페이지 무게를 늘리면서 발견 가능성이 낮았다. 이력서의 6가지 엔지니어링 원칙(Insights)을 사이트에 노출할 필요가 있었고, PKM 노트를 외부 공개할 경로도 필요했다. Hero와 About 섹션이 내용 중복이라는 판단도 있었다.

## Decision

**홈 페이지 구조:**
- Before: Hero → About → Experience → Projects → Knowledge Graph → Contact
- After: About → Experience → Insights → Projects → Contact

**각 결정의 이유:**
- Hero 제거: About이 "ABOUT ME" 레이블 + 제목 + 사진 + 본문으로 랜딩 역할 충분. 중복 제거.
- Insights 추가: 6가지 엔지니어링 원칙 카드. Projects 앞에 배치 → "원칙 → 증거" 흐름.
- Knowledge Graph → /blog 분리: 홈 무게 감소 + PKM 노트 공개 경로 확보.
- Insights → Projects 순서: 원칙을 먼저 제시하고 프로젝트로 증명하는 서사 구조.

**카피 변경 (FDE 포지셔닝):**
- topLabel: `Industrial AI & Data-Centric ML` → `System Architect`
- stat: `60% LLM API Cost ↓` (출처 불명) → `TCO 80% ↓ · Hosugator` (이력서 수치)
- About 본문: EPC PM → 클라우드 인프라 서사 → 의도적 감속 학습 + Docs-as-Code + 도메인 번역 서사

**블로그 노트 구조:**
```
content/notes/
├── projects/      포트폴리오 노트 10개
├── engineering/   ADR, 문서 아키텍처 9개
├── ai-systems/    에이전트, LLM 방법론 14개
├── knowledge-ops/ PKM, 지식 관리 5개
└── study/         aws-saa, eip, kdlc, salesforce (자격증 스터디 묶음)
```

study/ 분리 이유: 260+개 스터디 노트가 프로젝트/인사이트 노트를 묻힘. 최상위 경로 기준 카테고리 그룹핑으로 해결.

## Consequences

- Sidebar 앵커 버그 수정 필요: `href="#about"` → `href="/#about"` (/blog 등 서브 페이지에서 꼬임)
- /blog 라우트 신설로 CloudFront 서브 라우트 설정 필요 → [[CloudFront Function resolves sub-route AccessDenied on S3 static sites]]
- PKM → 사이트 업로드 워크플로우: `cp note.md content/notes/<category>/` → build → sync → invalidate

---

See Also:
- [[Hosugator Architecture - ver2.1]]
- [[Portfolio - Project - Hosugator]]
- [[CloudFront Function resolves sub-route AccessDenied on S3 static sites]]
- [[Career redirect to FDE from PM and data-driven ML experience]]

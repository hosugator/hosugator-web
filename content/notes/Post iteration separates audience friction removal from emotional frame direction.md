---
created: 2026-05-27
updated: 2026-05-27
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - writing
  - career
  - audience
publish: true
---

## Context

PKM SSOT 포스트 초안을 작성하는 과정에서 세 번의 리프레이밍이 발생했다. 원인은 메시지 품질이 아니라, 채용자 독자가 특정 프레이밍에서 느낄 반발 포인트를 사전에 인지하지 못한 것이었다.

- 초안 1 (1-노트): "팀 위키·레포 지식 소멸 → 개인 PKM이 SSOT"
- 초안 2 (다-노트 v1): "회사 업무 경험 → 개인 PKM 저장"
- 초안 2 (다-노트 v2): "업무 경험 추상화 → 개인 PKM 저장"
- 초안 3 (손실 방지 프레임): "batch_size 등 기술 결정의 이유, ADR의 한계 → PKM이 어디서든 꺼낼 수 있는 SSOT"
- 초안 4 (성장 프레임): "코드는 프로젝트와 함께 늙는다. 지식은 나와 함께 성장한다"

반발 포인트 제거 과정: "회사 업무 → 개인 저장소" 프레이밍 → 채용자 관점에서 IP/사칙 위반 신호.

프레임 전환 이유 (손실 방지 → 성장): 손실 방지 프레임("매번 같은 실험 반복")은 방어적이고 두려움에 기반한다. 성장 프레임("코드는 늙고, 지식은 성장한다")은 전향적이고 LinkedIn 독자에게 공명하는 방향이다. 메시지는 동일하되, 독자가 느끼는 감정적 방향이 다르다.

## Insight

### 독자의 반발 포인트 제거는 메시지 품질과 별개의 작업이다

메시지 명확성과 설득력이 높아도, 독자가 걸려 넘어지는 신호가 있으면 메시지가 전달되지 않는다. 순서가 있다:
1. 핵심 주장 구성
2. 주 독자 관점에서 반발 포인트 점검 → 제거 또는 대체

이 두 작업은 동시에 하기 어렵다. 초안 작성 후 독자 시뮬레이션을 별도 단계로 두는 게 효율적이다.

### 채용자 독자는 특정 카테고리의 신호에 민감하다

- IP/NDA 위반 가능성 — "회사 업무 내용 → 개인 저장소" 프레이밍
- 전 고용주에 대한 비판
- 팀 갈등·직장 내 불만의 공개 표현

이 신호들이 감지되면 내용과 무관하게 레드플래그로 처리된다.

### 프레이밍 교체는 메시지를 희석하지 않는다

동일한 SSOT 메시지를:
- "회사 업무 지식 → 개인 PKM" (IP 우려 유발)
- "개인 기술 환경(Linux·dotfiles·AI 도구) → 개인 PKM" (IP와 무관)

으로 대체해도 핵심 주장은 손상되지 않았다. 독자의 마찰을 줄이는 것이 메시지를 희석하는 것과 다르다.

## Related

- [[Contribution gets absorbed but insights survive only in personal PKM]] — IP 신호 우려가 발생한 원본 초안 (v1, 팀 기여 흡수 프레이밍)
- [[The why behind a technical decision is more reusable than the decision itself]] — 초안 3, 손실 방지 프레임 (batch_size 등 기술 결정 이유, ADR 한계)
- [[ADR documents the decision PKM extracts the principle]] — 초안 4, 성장 프레임 ("코드는 늙고, 지식은 성장") — 동일 메시지, 전향적 감정 방향
- [[Optimizing for non-primary audience introduces noise that bottlenecks the primary goal]] — 독자 정의가 모든 커뮤니케이션 결정의 선행 조건
- [[linkedin-post skill reads all semantically related notes and constrains only the output claim]] — 이 인사이트가 발생한 워크플로우

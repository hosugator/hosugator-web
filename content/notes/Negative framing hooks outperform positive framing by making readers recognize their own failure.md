---
created: 2026-05-28
updated: 2026-05-28
type: insight
status: 1-draft
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - writing
  - hook
  - ab-test
publish: true
---

## Context

LinkedIn 포스트 초안 작성 중 훅 프레임을 두고 고민했다. 긍정 프레임("코드는 늙고, 지식은 나와 함께 성장한다")과 부정 프레임("다음 프로젝트에서 같은 실험을 반복하고 있다면, 저장 위치가 문제다")을 비교하면서 부정 프레임이 더 눈에 들어온다는 관찰이 생겼다.

## Insight

### 부정 프레임 훅은 독자가 자신의 실패를 투영하게 만든다

긍정 프레임 훅은 "그렇군"으로 스크롤하게 만든다. 부정 프레임 훅은 "맞아, 나도 그랬어"로 멈추게 만든다. 차이는 독자의 미해결 문제나 과거 실패와 연결되느냐다.

부정 프레임이 효과적인 조건:
- 독자가 동일한 실패 경험을 가질 가능성이 높을 때
- 훅이 "이 문제의 해결책이 있다"는 기대를 심을 때
- 감정적 과장이나 공격성 없이 인식 가능한 수준일 때

### 같은 본문, 훅만 바꿔 A/B 테스트로 검증 예정

포스팅 관심도를 직접 비교하기 위해 동일 본문에 훅만 교체한 두 버전을 시간 간격을 두고 올릴 계획. 이 인사이트는 아직 가설이며 테스트 결과로 검증한다.

## Decision

**linkedin-post 스킬 훅 전략을 부정 프레임 기본으로 변경 (2026-05-28)**

변경 내용:
1. **훅 기본 프레임**: 긍정/기회 기반 → 부정/손실 기반. 독자가 "맞아, 나도 그랬어"를 느끼는 수준.
2. **중언 금지 규칙 추가**: 구체적 사례(케이스)에서 대비·인과가 이미 드러났다면 추상 원칙으로 재술하지 않는다. 케이스를 원칙으로 반복하면 독자가 같은 내용을 두 번 읽게 된다.
3. **Variant 섹션 추가**: 포스트 노트에 `## Variant` 섹션을 두고 A/B 테스트용 대안 훅을 저장한다.

전환 조건: A/B 테스트 결과가 부정 프레임의 우위를 지지하지 않을 경우 재검토.

## Verification

- [ ] A/B 테스트 실행 예정 — 동일 본문, 훅만 교체한 포스트 쌍 게시 후 engagement 비교
- 첫 실험 대상: [[Constraint placement determines what a system is optimizing for]]

## Related

- [[Author familiarity creates a blind spot for what feels obvious to new readers]] — 이 세션에서 함께 발견된 독자 관점 인사이트
- [[Constraint placement determines what a system is optimizing for]] — 이 인사이트가 적용된 첫 포스트
- [[Post iteration separates audience friction removal from emotional frame direction]] — 감정 프레임과 독자 마찰은 별개 축

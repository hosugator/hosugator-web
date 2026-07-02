---
created: 2026-05-27
updated: 2026-05-27
type: insight
status: 2-stable
subject: "[[PKM]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - pkm
  - skill-design
  - workflow
publish: true
---
## Context
하루 한 개 LinkedIn 포스트를 PKM 인사이트로부터 생성하는 워크플로우가 필요해졌다. 
기존 pkm-management 스킬의 `type: post` 형식은 1노트 → 1포스트 변환이었는데, 이것이 포스트의 설득력을 제한한다는 판단에서 별도 스킬을 설계했다.

## Insight
### 설득력 있는 포스트는 단일 노트가 아닌 다양한 맥락의 합성에서 나온다
단일 노트 변환은 "좋은 조언"을 만들고, 다양한 노트 합성은 "공감을 얻는 글"을 만든다. 차이는 구체적 경험, 실패 사례, 다른 맥락에서의 검증이 포함되느냐다.

## Decision
**linkedin-post 스킬 생성. 인풋은 최대화, 제약은 아웃풋에만.**

**인풋 규칙:**
- 소스 노트의 `## Related` 링크 전부 Read
- sc_search 0.65+ 노트 전부 Read
- 0.65 미만 무시 — "다른 맥락 소스"와 "억지 연결"의 경계선

**아웃풋 규칙:**
- 핵심 주장 하나로 압축
- 실제로 Read한 노트만 `## Source`에 링크

**0.65 임계값 근거:** bge-micro-v2 기준 0.65 미만은 의미론적 연관이 사실상 없는 구간. 설득력은 멀지만 연결 가능한 아이디어에서 나오고, 연결 자체를 만들어내야 하는 아이디어에서는 나오지 않는다.

**전환 조건:** 실제 포스트 생성 경험이 쌓이면서 0.65 임계값이 너무 높거나 낮다고 판단될 때 조정.

## Consequences
- 포스트 생성 시 토큰 소모가 pkm-management보다 많다 — 의도된 트레이드오프
- 1노트 변환 초안과 다노트 합성 초안을 비교 실험 예정 (SSOT 주제로 첫 실험)

## Related
- [[Constraints belong at the output stage when output quality scales with input diversity]] — 이 결정의 설계 원칙
- [[Personal knowledge base is the only SSOT that survives company changes and project endings]] — 스킬 첫 적용 대상 포스트 (1노트 초안)

---
created: 2026-06-01
updated: 2026-06-01
type: post
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - agent
  - calibration
  - ai-workflow
publish: true
---

## Source

[[Agent heuristics must be recalibrated through outcome tests not theoretical reasoning]] — 핵심 인사이트 전체
[[Agentic AI가 일으키는 out of the loop]] — 에이전트 규칙 품질이 중요한 배경: 설정 오류가 자동 반복되는 구조
[[Shadowing requires spec-first and adversarial review to build judgment not just familiarity]] — 같은 구조: 실행 후 검증으로 기준을 교정

## Draft

에이전트에게 잘못된 규칙을 주면, 그 실수가 자동으로 반복된다.

수동 작업에서는 뭔가 이상하면 그 자리에서 알아챈다. 에이전트는 규칙이 틀려도 매 세션 같은 방식으로 작동한다. "이 케이스는 다르게 처리해야 하는데"라는 판단을 실시간으로 끼워 넣을 수 없다.

AI 에이전트가 관련 정보를 검색할 때 쓰는 유사도 기준값을 0.80으로 이론적으로 설정했다. "높을수록 정밀도가 보장된다"는 직관으로. 충분히 합리적으로 보였다.

그런데 실제 운용에서 0.80 이상이 한 번도 나오지 않았다. 기준값 바로 아래 0.761 케이스를 직접 열어봤더니 — 에이전트가 이미 만든 결과물과 충돌하는 내용이 있었고, 전면 수정이 필요했다. 기준값이 너무 높게 설정된 거였다.

그 이후로 에이전트 규칙을 검증하는 방법을 바꿨다.

- 현행 기준 바로 아래에서 가장 높은 점수의 케이스를 찾는다
- 그 케이스가 결과를 실질적으로 바꾸는지 확인한다
- 바꾼다 → 기준이 너무 엄격하다. 완화한다
- 바꾸지 않는다 → 기준이 적절하다. 유지한다

이론은 경계 사례를 보기 전까지 검증되지 않는다. 에이전트는 그 검증 기회를 자동으로 건너뛴다.

당신의 에이전트 규칙은 마지막으로 언제 경계 사례로 테스트했나?

## Variant

에이전트 규칙의 품질은 설정할 때가 아니라, 경계 케이스를 테스트한 이후에 결정된다.

역치 0.80을 이론으로 설정했고, 역치 직하 0.761 노트가 결과를 바꿨다. 테스트 전까지 그 규칙이 맞는지 알 방법이 없었다. 에이전트가 반복하는 건 코드만이 아니다 — 규칙의 오류도 반복된다.

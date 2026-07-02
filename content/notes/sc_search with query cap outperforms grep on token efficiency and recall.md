---
created: 2026-05-22
updated: 2026-05-22
type: insight
status: 2-stable
subject: "PKM"
project: "PKM"
tags: [pkm, search, sc_search, grep, benchmark, embedding]
publish: true
---

## Context

PKM 노트 작성 파이프라인에서 기존 노트 탐색 방식을 grep에서 sc_search로 전환하는 과정 중, 4가지 방식을 같은 에이전트 태스크로 직접 실행하여 수치를 비교했다. 방식 1–3은 동일 주제(sc_search ADR 작성), 방식 4는 별도 주제(경량 임베딩 모델 study)로 테스트했다.

## Insight

### sc_search 2회 제한이 가장 효율적이나, 조건이 맞을 때만 작동한다

| 방식 | 탐색 쿼리 | 총 토큰 | 도구 호출 | 연결 노트 | sc_search 결과 |
|---|---|---|---|---|---|
| grep | 8회 | 28,201 | 13 | 3개 | N/A |
| sc_search (제한 없음) | 10회 | 38,213 | 19 | 2개 | 있음 |
| sc_search (2회 제한) | 2회 | 16,836 | 7 | 2개 | 있음 (0.791↑) |
| sc_search (2회 제한 + 영어 가이드) | 2회 sc_search + bash 3회 | 18,138 | 10 | 2개 | 0 (0.80 미만) → bash 폴백 |

### 쿼리 제한만으로도 토큰 56% 절감된다

제한 없음(38,213) → 2회 제한(16,836)으로 56% 감소. grep(28,201)보다도 40% 적다. 쿼리를 여러 번 반복하는 것이 탐색 품질을 높이지 않고 토큰만 소비한다는 것이 수치로 확인됐다.

### grep은 의미 연관 노트를 구조적으로 놓친다

grep 방식은 draft 상태의 노트 2개를 노이즈로 포함했고 표현이 다른 연관 노트를 놓쳤다. 노트 수(3개)가 가장 많지만 유효 정보 비율이 낮았다. 탐색 도구 호출도 13회로 sc_search 2회 제한보다 거의 두 배다.

### 영어 쿼리 가이드는 규율 유지에 기여하나 결과 품질과 직결되지 않는다

4차 테스트에서 에이전트는 영어 혼용 쿼리 규칙을 준수했고 2회 제한도 지켰다. 그러나 해당 주제(경량 임베딩 모델)가 볼트에 직접 색인된 기존 노트가 없어 sc_search 두 쿼리 모두 0.80 미만 결과를 반환했다. 에이전트는 bash ls/grep으로 폴백하여 관련 노트를 수동 탐색했고, 이로 인해 도구 호출이 10회로 증가했다.

이는 **sc_search는 이미 볼트에 색인된 관련 노트가 존재해야 효과가 있다**는 것을 보여준다. 새로운 주제를 처음 다룰 때는 sc_search 결과 없음 자체가 유용한 신호다 — "모델 표현 한계"가 아니라 "볼트 미색인 주제"임을 알려준다.

### 주제 다양성 보정: 공정한 비교는 방식 1–3

방식 4는 테스트 주제가 달라 직접 수치 비교가 부적절하다. 1–3 비교만으로도 sc_search 2회 제한의 우위는 명확하다. 4차 테스트의 기여는 "sc_search 미색인 시 폴백 동작 확인"이다.

---

[[sc_search over grep for PKM linking because semantic similarity finds expression-variant notes]] · [[Lightweight local embedding models trade accuracy for offline capability]]

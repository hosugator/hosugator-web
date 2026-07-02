---
created: 2026-06-04
updated: 2026-06-04
type: post
status: 3-superseded
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - linkedin
  - ml
  - manufacturing
  - data-quality
  - system-thinking
publish: true
---
superseded -> [[AI learns only from cases that survived the collection process]]

## Source
[[Image capture quality sets an information ceiling that no downstream model can exceed]] — 조명 설계가 정보 상한을 결정한다는 핵심 경험
[[Theoretical performance advantage only materializes when its preconditions are met]] — 병목이 모델 이전에 있다는 동일 구조

## Draft
AI를 도입했는데 기대만큼 안 나온다는 말을 자주 듣는다.

그때 대부분 더 좋은 AI 모델을 찾는다.

제조 AI 프로젝트에서 비슷한 상황을 겪었다. 불량 검출 성능이 모델을 교체해도 오르지 않았다. 원인은 모델이 아니었다. AI가 분석하는 이미지 자체에 해당 불량이 담기지 않고 있었다. 촬영 환경을 바꾸니 같은 모델로 성능이 올랐다.

AI는 입력된 데이터를 해석하는 도구다. 데이터에 정보가 없으면, AI가 그것을 만들어낼 수 없다.

이건 제조 현장만의 이야기가 아니다.
- 잘못 집계된 고객 데이터로 추천 AI를 돌리면 추천이 엉뚱하다
- 특정 지역 데이터만으로 학습한 부동산 AI는 다른 지역 시세를 못 잡는다
- 최근 3개월 판매 기록만으로 AI 수요 예측을 하면 계절 수요를 놓친다

AI 성능의 상한은 모델이 아니라 데이터가 만들어지는 과정에서 결정된다.

성능이 막힌다면, 모델보다 데이터 수집 과정을 먼저 보는 게 빠를 때가 있다.

## Variant

훅 대안 (질문형 / 비기술 독자 확장):

"AI를 도입했는데 기대만큼 안 나온다는 말을 자주 듣는다. 모델이 문제인 경우보다, 데이터가 만들어지는 과정이 문제인 경우가 많다."

---
created: 2026-06-04
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - data-quality
  - survivorship-bias
  - ai
  - system-thinking
publish: true
---
## Context
LinkedIn 포스트 작성 중 "리뷰를 쓰지 않는 고객의 불만은 추천 AI가 볼 수 없다"는 예시를 고르다가, 이것이 2차대전 전투기 보강 문제와 동일한 구조임을 인식했다. 수집된 데이터가 현실의 전부라고 가정하는 것이 어디서나 반복되는 오류임을 명시화.

## Insight
### 수집 가능성 자체가 편향을 만든다

데이터는 수집 과정에서 살아남은 것만 담긴다. 수집 과정에서 탈락한 케이스들의 패턴이 실제로는 더 중요할 수 있다.
2차대전 중 돌아온 전투기의 탄흔을 분석해 그 부위를 보강하려 했다. 통계학자 Abraham Wald는 반대를 주장했다 — 탄흔이 없는 부위야말로 보강해야 한다. 그곳을 맞은 비행기는 돌아오지 못했기 때문이다.
돌아온 비행기만 데이터에 있다. 돌아오지 못한 비행기는 없다.

### AI는 수집된 데이터의 패턴만 학습한다 — 수집되지 않은 현실은 보이지 않는다

- 리뷰를 쓰지 않는 고객의 불만은 추천 AI가 볼 수 없다. AI는 리뷰를 남긴 사람만 본다.
- 병원에 오지 않은 사람의 건강 패턴은 의료 AI의 학습 데이터에 없다.
- 폐업한 회사의 의사결정은 경영 분석 AI가 학습할 수 없다. 살아남은 회사만 데이터가 있다.
- 제조 라인에서 이미지에 담기지 않은 불량은 검출 AI가 찾을 수 없다.

### 데이터 공백 자체를 신호로 읽어야 한다

"왜 이 케이스가 데이터에 없는가"를 묻는 것이 데이터를 더 잘 이해하는 방법이다. 없는 이유가 랜덤하지 않다면, 그 부재 자체가 패턴이다.

## Related
- [[Image capture quality sets an information ceiling that no downstream model can exceed]] — 같은 구조의 물리적 버전: 캡처되지 않은 정보는 AI가 볼 수 없다
- [[Theoretical performance advantage only materializes when its preconditions are met]] — 데이터 전제 조건이 충족되지 않으면 모델 우위는 실현되지 않는다
- [[AI performance ceiling is set before the model runs]] — 이 인사이트를 LinkedIn 포스트로 확장한 버전

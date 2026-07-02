---
created: 2026-05-21
updated: 2026-05-21
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[DTK in 2026]]"
tags:
  - license
  - apache
  - patent
  - opensource
  - 
publish: true
---

## Context

VS Code 라이선스 검토 중 MIT vs Apache 비교를 설명하다가 처음 제대로 이해한 개념. "Apache가 더 자유로운가?"라는 질문에서 출발.

## Insight

### MIT와 Apache의 자유도는 관점에 따라 다르다

- 조건 수 기준: MIT가 더 자유롭다 (저작권 표시만)
- 법적 안전성 기준: Apache가 더 안전하다 (특허 조항 명시)

### Apache 특허 조항의 작동 방식

기여자들이 자신의 특허를 라이브러리 사용자에게 무상으로 허락한다. MIT에는 이 조항이 없어서 "라이브러리 안에 기여자의 특허가 포함되어 있을 때 사용자가 소송당할 수 있는가"가 법적으로 불명확하다.

### 보복 조항 (Retaliation clause)

Apache 라이브러리 사용자가 해당 라이브러리 관련 특허 소송을 제기하면, 그 즉시 Apache 라이선스가 종료된다. 특허 분쟁을 억제하는 구조적 장치.

### 기업이 Apache를 선호하는 이유

특허 불확실성을 명시적으로 제거하기 때문. Google, Microsoft 등 대기업 오픈소스 배포물 상당수가 Apache 2.0.

## Verification

- [[VS Code binary is Microsoft proprietary despite MIT source]]

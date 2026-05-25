---
created: 2025-12-22 Mon
tags:
  - interpretation
  - aws_exam_strategy
reference:
  - "[[EventBridge]]"
  - "[[Lambda]]"
  - "[[API Gateway]]"
  - "[[s3 event]]"
---
# Comparison - Interpreting Automation Triggers

## 비교 목적 (Objective)
선택지에 제시된 서비스 조합을 보고 AWS가 의도하는 작동 방식(스케줄링 vs 요청 기반)을 구분하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 서비스 조합 | 실제 의미 (의도) | 작동 타이밍 |
| :--- | :--- | :--- |
| **[[EventBridge + Lambda]]** | **스케줄링 (Scheduling)** | 정해진 시간 (매일 오전 9시 등) |
| **[[API Gateway + Lambda]]** | **요청 기반 (On-demand)** | 사용자가 클릭하거나 요청할 때 |
| **[[S3 Event + Lambda]]** | **이벤트 기반 (Event-driven)** | 파일이 업로드되거나 삭제될 때 |

## 선택 기준 및 로직 (Selection Criteria)

### [[EventBridge + Lambda]]를 정답으로 골라야 하는 경우
* **조건:** 문제에 특정 시간대(업무 시간 등)나 반복되는 주기(매주 등)가 언급될 때
    * *Ex:* "매일 12시간만 서버를 운영하고 싶다."

---
**Conclusion:**
EventBridge가 Lambda와 짝을 지어 나오면 "시계(Timer)를 맞췄구나"라고 이해하시면 정확합니다.
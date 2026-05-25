---
created: 2025-12-23 Tue
tags: [comparison, decision_making]
reference:
  - "[[Amazon SNS]]"
  - "[[Amazon EventBridge]]"
---
# Comparison - SNS vs EventBridge for S3 Events

## 비교 목적 (Objective)
S3 버킷 이벤트 발생 시 다중 타겟으로의 확장성과 운영 편의성을 고려한 메시지 브로커 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[Amazon SNS]] | [[Amazon EventBridge]] |
| :--- | :--- | :--- |
| **핵심 철학** | 메시지 게시/구독(Pub/Sub) 서비스 | 서버리스 이벤트 버스 (Event Bus) |
| **장점 (Pros)** | 단순 알림 전송 속도가 매우 빠름 | AWS 서비스 간 직접 통합 범위가 매우 넓음 |
| **단점 (Cons)** | 지원하는 타겟 서비스 종류가 제한적임 | SNS 대비 아주 미세한 지연 시간이 있을 수 있음 |
| **비용/관리** | 메시지 전달 횟수당 과금 | 규칙(Rule) 매칭 및 전달 횟수당 과금 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Amazon SNS]]를 선택해야 하는 경우
* 타겟이 오직 Lambda, SQS, 이메일, HTTP 엔드포인트 중 하나인 경우
* 초당 수만 건 이상의 메시지를 지연 없이 즉시 뿌려야 하는 고성능 알림 시스템인 경우
* 단순하게 "이벤트가 발생했다"는 사실을 여러 구독자에게 전달하는 것이 목적인 경우

### [[Amazon EventBridge]]를 선택해야 하는 경우
* 타겟이 SageMaker Pipelines, Step Functions 등 SNS가 직접 지원하지 않는 서비스인 경우
* 이벤트 데이터의 특정 값을 분석하여 정교한 필터링 규칙을 적용해야 하는 경우
* 여러 AWS 계정이나 SaaS 애플리케이션(Zendesk, Datadog 등)과 이벤트를 주고받아야 하는 경우

---
**Conclusion:**
단순 알림 전달은 SNS가 유리하나, 다양한 AWS 서비스와의 복합적인 워크플로우 구성에는 EventBridge가 최적임
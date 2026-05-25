---
created: 2026-01-16
tags:
  - AWS
  - ECS
  - Fargate
  - EventBridge
---
# Scheduled Batch Processing (ECS Fargate)

## 본질 (Essence)
정해진 시간에만 나타나 묵묵히 한 시간 동안 대청소를 하고 스스로 사라지는 인공지능 로봇 청소기

## 구조 (Mechanism)
- **정의**: 서버 관리 부담 없이 컨테이너 단위의 작업을 예약 실행하는 서버리스 배치 아키텍처입니다.
- **핵심**: 
    - **ECS Task**: 컨테이너화된 애플리케이션의 최소 실행 단위로, 독립적인 환경에서 로직을 수행합니다.
    - **Fargate Launch Type**: 인스턴스 관리 없이 CPU/메모리만 지정하여 실행 시간을 초과하는 긴 작업을 처리합니다.
    - **EventBridge**: 특정 시간에 트리거를 발송하여 작업을 자동화하는 스케줄러 역할을 합니다.

## 확장 (Connection)
- **연결**: AWS Lambda Concurrency가 짧은 요청에 특화되었다면, Fargate는 무거운 분석 작업에 최적입니다.
- **응용**: 일 단위 로그 집계, 대규모 이미지 프로세싱, 정기적인 데이터 이관(ETL) 작업 등에 표준으로 사용됩니다.

---
See Also: 
- [[ECS]]
- [[Fargate]]
- [[Batch]]
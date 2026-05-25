---
created: 2026-01-16
tags:
  - AWS
  - EventBridge
  - Automation
  - Architecture
---
# Event-Driven Automation (이벤트 기반 자동화)

## 본질 (Essence)
개별 리소스를 직접 조종하는 대신, 상황(시간/사건)에 맞는 명령을 내리는 '중앙 관제탑' 중심의 운영 방식

## 구조 (Mechanism)
- **ECS Task**: 특정한 비즈니스 로직을 수행하기 위해 정의된 컨테이너 실행 단위입니다. (DB의 트랜잭션처럼 완결성을 가진 하나의 작업)
- **EventBridge (Scheduler)**: 시간 기반(Cron) 또는 상태 변화 기반의 트리거를 생성하고, 적절한 대상(Target)에게 작업 시작 신호를 보냅니다.
- **Workflow Control**: 사용자는 인프라의 세부 사항보다 '이벤트 규칙'과 '타겟 연결'을 관리함으로써 운영 효율성을 극대화합니다.

## 확장 (Connection)
- **연결**: [[Scheduled Batch Processing (ECS Fargate)]]이 '시간'에 집중한다면, 일반적인 EventBridge 활용은 서비스 간의 '상태 변화'를 연결하는 것으로 확장됩니다.
- **응용**: 정기 배정 작업(Cron), 시스템 장애 알림 자동화, 데이터 업로드 시 자동 프로세싱 등 자동화가 필요한 모든 AWS 설계의 핵심 고리로 사용됩니다.

---
See Also: 
- [[Step Functioins]]
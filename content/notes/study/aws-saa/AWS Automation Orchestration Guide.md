---
created: 2026-01-22
tags:
  - AWS
  - Automation
  - Decision_Making
---
# AWS Automation Orchestration Guide

## 본질 (Essence)
물량은 Batch에게, 복잡한 절차는 Step Functions에게, 단순한 신호 전달은 EventBridge에게 맡기는 적재적소의 원칙. 특히 Batch는 **실행(Execution)**을, Step Functions는 **조율(Orchestration)**을 담당함.

## 구조 (Mechanism)
- **AWS Batch**: 
    - **역할**: 직접 컴퓨팅 자원(EC2/Fargate)을 확보하여 컨테이너를 실행하는 **실행 엔진**.
    - **특징**: 다양한 언어/팀의 태스크를 Docker 컨테이너로 격리하며, 대규모 물량을 성능 저하 없이 처리하는 데 최적화.
- **Step Functions**: 
    - **역할**: 스스로 자원을 생성하지 않고, 외부 리소스(Lambda, Batch 등)의 상태를 관리하는 **지휘자**.
    - **특징**: 작업 간의 의존성, 순서, 실패 시 재시도 로직을 제어하는 상태 머신 기반의 서비스.
- **EventBridge**: 
    - **역할**: 특정 시간(Schedule)이나 사건 발생 시 신호를 전달하는 **서버리스 스위치**.
    - **특징**: 시스템 간의 직접적인 연결 없이도 유연하게 태스크를 트리거함.

## 확장 (Connection)
- **연결**: 실제로 화물을 싣고 달리는 **트럭(Batch)**과 전체 배송 경로 및 스케줄을 관리하는 **물류 관제 센터(Step Functions)**의 차이.
- **응용**: 
    - 15분 이내 처리: **Lambda**
    - 1시간 이상의 대규모/컨테이너 작업: **Batch**
    - 여러 Batch/Lambda 작업을 순서대로 엮어야 할 때: **Step Functions**가 Batch를 호출하여 관리.

---
See Also: 
- 
---
created: 2025-11-21
tags:
  - aws_saa
  - high_availability
  - fault_tolerance
  - disaster_recovery
  - resilience
  - architecture_design
reference:
  - "[[Recovery Objectives - RTO·RPO]]"
  - "[[Disaster Recovery Strategies]]"
  - "[[Database Service Resilience]]"
  - "[[Staging Area]]"
  - "[[Storage Service for DR]]"
  - "[[Observability and Automation]]"
  - "[[Networking and Routing]]"
---
# 고가용성·내결함성 아키텍처 (복원력 설계)
## 정의
시스템 구성 요소의 장애나 대규모 재해에 대비하여 서비스의 연속성을 보장하고, 설정된 목표(RTO 및 RPO)에 따라 신속하고 안정적인 복구를 수행하도록 시스템을 설계하는 방법론
## 요소
### 단일 장애 지점 제거 (Single Point of Failure, SPOF)
전체 시스템 중단으로 이어질 수 있는 하나의 취약한 구성 요소(서버, DB 등)를 식별하고, 이중화를 통해 이를 완화하는 필수 설계 원칙이다.
### 고가용성 (High Availability, HA)
시스템 가동 시간을 최대화하는 것을 목표로 한다. 구성 요소 장애 시 신속하게 교체 또는 복구하여 서비스 상태로 되돌린다.
### 내결함성 (Fault Tolerance, FT)
하나 이상의 구성 요소에 장애가 발생하더라도 가동 중단 없이 시스템이 계속 작동하는 기능이다. HA보다 높은 수준의 이중화를 요구하며 비용이 더 많이 든다.
### 재해 복구 (Disaster Recovery, DR)
화재나 자연재해와 같은 광범위한 재해에 대비하여 사전 계획을 수립하고, 데이터를 현장 외(Offsite)에 백업하며, 시스템 복구를 위한 절차를 마련하는 활동이다.
## 원리
### 복구 목표 설정 (RTO/RPO)
아키텍처 설계에 앞서 RTO(복구 시간 목표)와 RPO(복구 시점 목표)를 결정한다. 이는 비즈니스 연속성 요구 사항을 충족하기 위한 전략 선택의 기준이 된다.
### Active/Passive (활성/대기)
고가용성을 달성하는 일반적인 구조이다. 하나의 서버가 활성 모드이고 다른 서버는 대기 모드이다. 장애 조치 시 약간의 가동 중단 시간이 발생할 수 있다.
### Active/Active (활성/활성)
내결함성을 달성하는 일반적인 구조이다. 두 개 이상의 서버가 동시에 트래픽을 처리하며, 하나의 서버 장애 시 가동 중단 없이 서비스가 유지된다.
## 특징
### AWS 글로벌 인프라 활용
Multi-AZ, Multi-Region에 걸쳐 리소스를 이중화 및 배포하고, Amazon Route 53의 장애 조치 라우팅 기능 및 AWS Global Accelerator를 활용하여 지리적 장애로부터 복원력을 확보한다.
### 레거시 애플리케이션 지원
구성 요소 마이그레이션이 불가능한 레거시 애플리케이션의 경우, AWS Elastic Disaster Recovery (AWS DRS)를 사용하여 온프레미스 또는 클라우드 기반 애플리케이션의 복원력을 향상한다.
## 비교
| 구분 | 고가용성 (HA) | 내결함성 (FT) | 재해 복구 (DR) |
| :--- | :--- | :--- | :--- |
| 핵심 목표 | 신속한 복구 및 가동 시간 최대화 | 장애 발생 중단 없이 서비스 지속 | 광범위한 재해에 대한 사전 계획 및 복구 |
| 예상 중단 | 매우 짧은 가동 중단 시간이 발생할 수 있음 | 실질적으로 가동 중단 시간이 없음 | RTO 목표에 따라 가변적 |
| 일반 구조 | Active/Standby | Active/Active | 백업 및 복원, 웜 스탠바이 등 |
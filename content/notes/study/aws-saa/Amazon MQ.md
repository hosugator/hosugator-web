---
created: 2025-12-17 Wed
tags:
  - aws_saa
  - amazon_mq
  - messaging
  - high_availability
  - managed_service
reference:
  - "[[Effective Permissions Calculation]]"
---
# Amazon MQ & Managed High Availability

## 정의 (Definition)
RabbitMQ 및 Apache ActiveMQ와 같은 오픈 소스 메시지 브로커를 AWS에서 간편하게 설정, 운영 및 관리할 수 있도록 지원하는 완전 관리형 메시징 서비스.

## 핵심 맥락 (Context & Why)
-  Problem: EC2에 직접 메시지 브로커를 구축할 경우, 고가용성을 위한 다중 가용 영역(Multi-AZ) 클러스터링과 데이터 복제, 버전 업데이트 등을 직접 관리해야 하므로 운영 부담이 매우 크다.
 - Solution: Amazon MQ의 관리형 아키텍처를 사용하여 인프라 관리 부담을 AWS에 위임하고, 클릭 몇 번으로 장애 조치(Failover) 기능이 내장된 고가용성 메시징 환경을 구현한다.

## 작동 원리 (Mechanism)
- Multi-AZ 배포: Active-Standby 모드에서 AWS는 서로 다른 가용 영역에 두 개의 브로커 인스턴스를 생성한다.
- 데이터 동기화: 공유 저장소 또는 복제 메커니즘을 통해 두 인스턴스 간 데이터를 동기화한다.
- 자동 장애 조치: 기본(Active) 브로커에 장애가 발생하면 AWS가 자동으로 대기(Standby) 브로커로 엔드포인트를 전환하여 서비스 중단을 최소화한다.

## 유비 및 비교 (Analogy & Comparison)
-  It's like: 자가 자가용 vs 렌터카 서비스
	 - EC2 RabbitMQ: 차를 직접 사고 소모품을 교체하며 정비하는 것(운영 오버헤드 높음).
	 - Amazon MQ: 정비와 보험이 포함된 렌터카를 빌려 타는 것(운영 오버헤드 최소화).
 - vs [[Amazon SQS]]: 
	 - Amazon MQ: 기존의 오픈 소스 표준(RabbitMQ 등)을 클라우드로 그대로 옮길 때(Migration) 유리하다.
	 - [[SQS]]: AWS 전용 서버리스 큐로, 무한한 확장성이 필요하고 표준 프로토콜 준수가 필수가 아닐 때 사용한다.

## 예시 및 구조 (Example/Structure)
### 고가용성 이커머스 아키텍처
- 메시지 전달: 주문 발생 시 Amazon MQ(RabbitMQ)가 다중 AZ에 걸쳐 대기하며 메시지를 수신함.
- 처리: Auto Scaling 그룹 내의 EC2 인스턴스들이 메시지를 소비하여 처리함.
- 저장: 최종 결과는 Multi-AZ가 적용된 [[RDS]] PostgreSQL에 저장되어 전 구간 고가용성을 보장함.
---
created: 2025-11-20
tags:
  - aws_saa
  - rds
  - aurora
  - multi_az
  - rds_proxy
  - resilience
  - high_availability
reference:
  - "[[RDS Proxy]]"
---
# Amazon RDS and Aurora Resilience (복원력)
## 정의
AWS 관리형 관계형 데이터베이스 서비스에서 하드웨어 장애·네트워크 중단·가용 영역(AZ) 장애 등 예상치 못한 시스템 문제 발생 시에도 데이터베이스의 가용성을 유지하고 데이터를 보호하는 메커니즘
## 요소
### Multi-AZ Deployment (다중 가용 영역 배포)
RDS 또는 Aurora 인스턴스를 두 개 이상의 물리적으로 분리된 가용 영역에 배포하여 고가용성(High Availability, HA)을 제공하는 아키텍처이다.
### Standby Instance (대기 인스턴스)
Multi-AZ 환경에서 Primary DB와 동기식으로 데이터를 복제하는 읽기 불가능한(Read-Only 불가) 인스턴스이다. 장애 발생 시 자동으로 Primary로 승격된다.
### Failover (장애 조치)
Primary DB에 장애가 발생할 경우, RDS가 자동으로 Standby Instance로 DNS 엔드포인트를 전환하여 서비스 중단 시간을 최소화하는 과정이다.
### RDS Proxy
애플리케이션과 데이터베이스 사이에 위치하는 완전 관리형 데이터베이스 [[Proxy]]이다. 연결 풀링(Connection Pooling) 기능을 제공하고, 장애 조치 시간을 단축시킨다.
## 원리
### 고가용성 구현 (High Availability)
Multi-AZ 배포는 Primary 인스턴스에서 대기 인스턴스로 데이터를 동기식(Synchronous)으로 복제한다. 이로 인해 데이터 손실 없이 실시간으로 Primary DB의 상태를 유지한다. 장애 발생 시, RDS는 DNS CNAME 레코드를 Standby 인스턴스를 가리키도록 업데이트하여 Failover를 수행한다.
### 복원력과 성능의 분리
- Multi-AZ는 오직 복원력과 가용성을 위한 것이며, 대기 인스턴스는 트래픽을 처리하지 않으므로 성능 확장(Scale-out) 효과는 없다.
- Read Replicas는 성능 확장을 위한 것이며, 복원력에 기여하지만 비동기식 복제로 인해 Multi-AZ만큼 엄격한 데이터 정합성(Consistency)을 보장하지 않는다.
### RDS Proxy의 역할
- 연결 관리: 데이터베이스 연결을 효율적으로 재사용(풀링)하여, 애플리케이션의 확장성을 높이고 DB 연결 수가 폭증하는 것을 방지한다.
- 장애 조치 시간 단축: 장애 조치 시, 프록시가 기존 연결을 자동으로 보존하고 새로운 Primary DB로 라우팅하여 애플리케이션 레벨의 장애 조치 시간을 최대 66%까지 단축시킨다.
## 특징
### Aurora의 복원력 아키텍처
Aurora는 자체적으로 분산된 스토리지 시스템을 사용하여 Multi-AZ와 유사한 높은 복원력을 제공하며, 데이터 복제본을 6개까지 여러 AZ에 걸쳐 자동 저장한다. Failover 시간이 RDS의 기본 Multi-AZ보다 훨씬 빠르다.
### 비용 최적화 (Multi-AZ)
Multi-AZ는 대기 인스턴스에 대한 요금이 추가로 발생하지만, 장시간의 다운타임으로 인한 비즈니스 손실과 비교했을 때 훨씬 비용 효율적인 고가용성 투자이다.
### RDS Proxy의 보안 강화
프록시는 IAM 인증을 지원하여 데이터베이스 자격 증명을 코드에 직접 하드 코딩할 필요 없이 보안을 강화한다.
## 비교
| 구분 | Multi-AZ Standby | Read Replica |
| :--- | :--- | :--- |
| 주요 목표 | 고가용성 및 복원력 | 읽기 성능 확장 및 부하 분산 |
| 복제 방식 | 동기식 (Synchronous) | 비동기식 (Asynchronous) |
| 읽기 트래픽 처리 | 불가 (읽기 크기 조정 불가) | 가능 (읽기 트래픽 처리) |
| 장애 조치 | 자동 Failover에 사용 | Primary DB 장애 시 수동으로 Promotion 가능 |
## 예시
### 고가용성 필수 아키텍처 설계
1. 금융 서비스처럼 24/7 가동이 필수적이고, 데이터 손실이 허용되지 않는 워크로드에 Amazon Aurora Multi-AZ 구성을 선택한다.
2. 애플리케이션 서버(Lambda 또는 EC2)가 대규모로 확장되어 DB 연결 부하가 높아질 것으로 예상될 때, RDS Proxy를 도입하여 연결 풀링을 사용함으로써 DB의 연결 요청 부담을 낮추고 애플리케이션의 확장성과 복원력을 동시에 개선한다.
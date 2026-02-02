---
created: 2025-11-26
tags: [aws_saa, cost_optimization, ebs, volume_type, io_performance, ssd, hdd, gp3, throughput]
reference:
  - "[[Cost-Optimized Storage Solutions]]"
  - "[[EC2]]"
---
# EBS Volume Types and Cost Optimization (EBS 볼륨 유형 및 비용 최적화)
## 정의
워크로드의 성능(IOPS, 처리량) 요구 사항에 따라 가장 적합한 [[EBS]] 볼륨 유형을 선택함으로써 비용 효율성을 극대화하는 설계 전략
## 요소
- SSD 기반 볼륨 (트랜잭션 워크로드):
    - [[gp3]] (General Purpose SSD): 대부분의 워크로드에 비용 효율적인 성능을 제공하는 범용 볼륨.
    - [[io2 Block Express]] (Provisioned IOPS SSD): 지연 시간 및 IOPS 성능이 가장 중요하고 최고 수준의 내구성이 필요한 미션 크리티컬 워크로드용.
- HDD 기반 볼륨 (처리량 워크로드):
    - [[st1]] (Throughput Optimized HDD): 로그 처리·데이터 웨어하우스 등 자주 액세스하는 대규모 순차 I/O 워크로드용.
    - [[sc1]] (Cold HDD): 파일 서버 등 액세스 빈도가 매우 낮은 워크로드의 최저 비용 장기 보관용.
- [[Instance Store]]: 로그 파일 및 중요하지 않은 데이터에 적합한 비영구 스토리지로, EC2 시간당 요금에 포함되는 스토리지 옵션.
## 원리
### Performance Matching (성능 일치 원리)
워크로드에 필요한 IOPS(초당 입출력 작업)와 처리량(Throughput) 수준을 정확히 파악하여, 과도하게 프로비저닝된 고가 볼륨(예: [[io2]]) 대신 요구 사항을 충족하는 최저가 볼륨(gp3 또는 st1)을 선택하여 불필요한 비용을 절감하는 원리.
### Decoupling Performance (성능 분리)
[[gp3]]는 이전 [[gp2]]와 달리, 볼륨 크기와 관계없이 IOPS와 처리량을 독립적으로 프로비저닝할 수 있으므로, 스토리지는 적게 필요하지만 높은 성능이 필요한 경우에 가장 비용 효율적인 구조.
## 특징
### SSD vs HDD
- SSD (gp3, io2): IOPS당 비용이 낮고 트랜잭션 및 랜덤 I/O 성능이 우수하여 부팅 디스크 및 데이터베이스에 적합하다.
- HDD (st1, sc1): 처리량(MB/s)당 비용이 낮고 순차 I/O 성능이 우수하여 대규모 데이터 처리 및 콜드 스토리지에 적합하다.
### Snapshot Optimization (스냅샷 최적화)
EBS 스냅샷은 증분(Incremental) 방식으로 저장되지만, 장기적으로 비용이 누적되므로, 불필요한 스냅샷을 주기적으로 삭제하는 것이 비용 최적화의 핵심. [[Trusted Advisor]]는 연결되지 않은 볼륨을 식별하고, [[Data Lifecycle Manager]]는 스냅샷 자동 삭제를 지원하는 기능.
## 예시
### 비용 효율적인 개발 서버 볼륨 선택
1. 요구 사항: 개발 환경용 [[EC2]] 인스턴스에 100GB의 볼륨이 필요하며, 성능은 3,000 IOPS 정도만 충족하면 된다.
2. 솔루션 선택: [[gp3]] 볼륨을 사용한다.
3. 결과: [[gp3]]는 3,000 IOPS와 125 MiB/s를 기본 제공하므로, 최소 크기인 1GB부터 해당 성능을 추가 비용 없이 사용할 수 있어 최저 비용으로 요구 사항을 충족한다.
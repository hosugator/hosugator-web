---
created: 2025-11-25
tags:
  - aws_saa
  - aurora_serverless
  - storage_autoscaling
  - acu
  - cost_optimization
  - elasticity
reference:
  - "[[High-Performing Database Solutions]]"
---
# Aurora Serverless and Storage Auto Scaling (Aurora 서버리스 및 스토리지 자동 확장)
## 정의
[[Aurora]] 데이터베이스를 위한 온디맨드 자동 크기 조정 구성으로, 애플리케이션의 요구 사항에 따라 컴퓨팅 용량(ACU)을 자동으로 확장 및 축소하며, 예측 불가능하거나 간헐적인 워크로드에 비용 효율적인 솔루션을 제공하는 서비스
## 요소
### Aurora Capacity Unit (ACU)
[[Aurora Serverless]]에서 컴퓨팅 및 메모리 리소스를 측정하고 할당하는 단위이다.
- Min/Max ACU: 클러스터가 확장 및 축소될 수 있는 최소 및 최대 ACU 범위를 지정한다.
### Storage Auto Scaling
[[Aurora Shared Cluster Volume]]의 기능으로, 데이터 사용량에 따라 스토리지를 자동으로 확장한다 (최대 128TB).
### Pause Functionality (일시 중지 기능)
설정된 비활성 기간이 지나면 ACU가 0으로 내려가고 클러스터가 자동으로 일시 중지(Pause)되며, 컴퓨팅 비용이 발생하지 않는다.
## 원리
### Load-Based Scaling (로드 기반 확장)
[[Aurora Serverless]]는 클러스터에 부하가 증가하면 Min ACU에서 Max ACU 사이에서 용량을 추가 또는 제거하여 자동으로 크기 조정을 수행하며, 인스턴스를 프로비저닝하거나 관리할 필요가 없다.
### Cost Efficiency (비용 효율성 원리)
워크로드가 사용되지 않는 경우(예: 밤, 주말) 클러스터가 일시 중지되어 컴퓨팅 용량에 대한 비용을 절감하며, 이 기간 동안에는 사용 중인 스토리지에 대해서만 비용을 지불한다.
### Decoupled Storage (스토리지와 컴퓨팅의 분리)
[[Aurora Serverless]]는 프로비저닝된 [[Aurora]]와 마찬가지로 [[Aurora Shared Cluster Volume]]을 사용하므로, 스토리지 자체는 3개 AZ에 6중 복제된 내구성을 유지하면서 컴퓨팅 계층만 탄력적으로 확장된다.
## 특징
### Ideal for Intermittent Workloads (간헐적 워크로드에 최적화)
사용량이 낮거나 간헐적이며, 예측할 수 없는 개발/테스트 환경이나 사용 빈도가 낮은 내부 애플리케이션에 가장 적합하다.
### RDS Auto Scaling Limits Overcome (RDS 자동 확장 한계 극복)
기존 [[RDS]]의 자동 크기 조정이 스토리지에만 한정되는 것과 달리, [[Aurora Serverless]]는 컴퓨팅 용량까지 자동으로 확장 및 축소하여 완전한 탄력성을 제공한다.
## 예시
### 내부 보고서 생성 시스템
1. 요구 사항: 월요일 아침 2시간 동안만 집중적으로 DB를 사용하고, 나머지 시간에는 사용하지 않는 시스템.
2. 솔루션: [[Aurora Serverless]]를 설정하고, 비활성 시 클러스터 일시 중지 기능을 활성화한다.
3. 결과: 보고서 생성 시간 동안에는 높은 ACU로 성능을 확보하고, 나머지 시간에는 자동으로 일시 중지되어 컴퓨팅 비용이 최소화된다.
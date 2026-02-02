---
created: 2025-11-26
tags: [aws_saa, cost_optimization, storage, s3_class, ebs_type, lifecycle_policy, cold_storage]
reference:
  - "[[Cost-Optimized Architectural Design]]"
  - "[[S3]]"
---
# Cost-Optimized Storage Solutions (비용이 최적화된 스토리지 솔루션 설계)
## 정의
데이터의 접근 빈도·보존 기간·복원력 요구 사항에 기초하여 최저 비용의 스토리지 클래스와 효율적인 관리 정책을 선택함으로써 전체 스토리지 비용을 최소화하는 설계 원칙
## 요소
- [[S3]] Storage Classes: 데이터의 접근 빈도와 복원력에 따라 선택하는 다양한 스토리지 계층.
- [[EBS Volume Types]]: 워크로드의 성능과 비용을 고려하여 선택하는 블록 스토리지 유형.
- [[Instance Store]]: [[EC2]] 인스턴스에 로컬로 연결된 비영구 임시 스토리지.
- [[Lifecycle Policies]]: 데이터 수명 주기에 따라 접근 빈도가 낮은 데이터를 자동으로 저가 클래스(예: [[Glacier]])로 이동시키는 정책.
## 원리
### Data Tiering (데이터 계층화 원리)
데이터를 핫(Hot, 자주 접근) $\to$ 웜(Warm, 가끔 접근) $\to$ 콜드(Cold, 거의 접근 안 함)로 분류하고, 각 계층에 맞춰 가장 낮은 비용의 스토리지 솔루션을 매칭하는 전략.
### Access Pattern Matching (접근 패턴 일치)
스토리지 비용 구조는 저장 비용과 접근(Retrieval) 비용으로 나뉜다. 접근 빈도가 드문 데이터는 저장 비용이 낮은 클래스(예: [[S3 Glacier]])를 선택하여 비용을 최적화하는 원리.
### Storage Type Alignment (스토리지 유형 정렬)
애플리케이션의 파일 시스템 요구 사항에는 [[EBS]]와 같은 블록 스토리지나 [[EFS]]를 사용하고, 객체 저장소가 필요한 경우에만 [[S3]]를 사용하는 원칙.
## 특징
### S3 Intelligent-Tiering
데이터 접근 패턴을 자동으로 모니터링하고, 접근 빈도에 따라 데이터를 두 개의 접근 계층 간에 자동으로 이동시켜 운영 오버헤드 없이 비용을 최적화하는 기능.
### Requester Pays (요청자 지불)
S3 버킷을 구성하여 버킷 소유자 대신 객체 요청 및 데이터 전송 비용을 요청자가 지불하도록 설정하는 비용 제어 옵션.
### Data Migration Optimization (데이터 마이그레이션 최적화)
하이브리드 환경의 대규모 데이터 전송 시 [[Snow Family]] (Snowball, Snowmobile)와 같은 물리적 장치를 사용하거나 [[DataSync]] 등을 고려하여 네트워크 전송 비용을 최소화하는 전략.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  [[Comparison - S3 Storage Classes]] (S3 스토리지 클래스 비교)
2.  [[EBS Volume Types and Cost Optimization]] (EBS 볼륨 유형 및 비용 최적화)
3.  [[Data Lifecycle Management]] (데이터 수명 주기 관리)
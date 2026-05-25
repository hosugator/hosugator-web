---
created: 2026-01-07
tags:
  - crr
  - cross_region_replication
  - s3
  - aws
  - asynchronous
  - bucket
  - dr
  - iam
---
# Cross-Region Replication (CRR)

## 요약 (Summary)
서로 다른 AWS 리전의 S3 버킷 간에 객체를 자동으로 비동기 복제하는 버킷 수준의 기능

## 배경 (Background)
- 핵심 과제: 특정 리전의 물리적 장애에 대비한 재해 복구(DR) 계획이 필요하거나, 전 세계 사용자에게 낮은 지연 시간으로 데이터를 제공해야 함
- 제약 사항: S3는 글로벌 네임스페이스를 가지지만 데이터는 기본적으로 단일 리전에 저장되므로, 멀티 리전 가용성을 위해서는 별도의 복제 메커니즘이 필수적임

## 솔루션 (Solution)
- 작동 메커니즘: 원본 버킷에 객체가 업로드되면 S3가 이를 감지하여 설정된 대상 리전의 버킷으로 데이터를 비동기 전송함
- 필수 조건: 
	1. 원본 및 대상 버킷 모두 버전 관리(Versioning)가 활성화되어야 함
	2. S3가 대신 데이터를 전송할 수 있는 적절한 IAM Role 권한이 필요함
- 특징: 객체 메커니즘, 메타데이터, ACL 등이 유지되며 암호화된 객체도 복제 가능(KMS 설정 필요)

## 변별점 (Distinction)
- SRR(Same-Region Replication)과의 차이: SRR은 동일 리전 내 다른 계정이나 테스트/운영 환경 분리용으로 사용하며, CRR은 지리적 거리 확보를 통한 재해 복구에 특화됨
- 타 서비스의 리전 복제:
	- [RDS]: 'Cross-Region Read Replica'를 통해 DB 인스턴스를 복제함
	- [DynamoDB]: 'Global Tables'를 통해 멀티 마스터 복제를 구현함
	- [CRR]: 오직 S3 객체 데이터의 리전 간 복제만을 지칭하는 용어임

---
See Also:
- [[Disaster Recovery Strategies]]
- [[RDS]]
- [[DynamoDB]]
- [[IAM]]
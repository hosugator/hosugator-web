---
created: 2025-11-25
tags:
  - aws_saa
  - data_lake
  - security
  - governance
  - encryption
  - iam
  - kms
  - s3_policy
  - lake_formation
  - pii
reference:
  - "[[High-Performing Data Ingestion and Transformation Solutions]]"
  - "[[IAM]]"
  - "[[KMS]]"
  - "[[S3]]"
---
# Data Lake Security and Governance (KMS, IAM, S3 Policies)
## 정의
데이터 레이크 보호를 위해 [[S3]] · [[Glue]] Data Catalog 및 분석 서비스에 대한 접근을 제어하고 암호화하는 일련의 보안 및 거버넌스 원칙
## 요소
- [[IAM]] User/Role: 사용자 및 서비스의 인증과 인가를 관리하여 데이터 접근 주체를 정의한다.
- [[S3]] Bucket/Object Policy: 버킷 및 객체 수준에서 리소스 기반 접근 제어를 정의한다.
- [[KMS]] (Encryption Key Management): [[S3]] 데이터의 저장 시 암호화(Encryption at Rest)에 사용되는 암호화 키를 안전하게 생성·관리한다.
- [[Lake Formation]]: 중앙 집중식으로 데이터 레이크의 세분화된 접근 제어를 관리하고 구축을 단순화한다.
- [[CloudTrail]]: 데이터 접근 및 관리 활동에 대한 모든 기록을 남겨 감사(Auditing)를 지원한다.
## 원리
### Least Privilege (최소 권한 원칙)
모든 사용자 및 서비스 역할에 데이터 처리나 분석에 필요한 최소한의 권한만 부여한다. [[IAM]] 정책과 S3 버킷 정책을 결합하여 권한을 교차 확인하는 것이 모범 사례이다.
### Defense in Depth (다층 방어 원칙)
데이터 전송(TLS/SSL) $\to$ 데이터 저장(KMS 암호화) $\to$ 데이터 접근(IAM/S3 Policies/Lake Formation) 등 여러 보안 계층을 적용하여 [[SPOF]]로 인한 데이터 유출 위험을 최소화한다.
## 특징
### Data Encryption (데이터 암호화)
- 저장 시 (At Rest): [[S3]]는 SSE-S3 · SSE-KMS (사용자 키 관리) · SSE-C (고객 제공 키) 옵션을 제공한다. 민감 데이터에는 [[KMS]]를 통한 SSE-KMS 사용이 권장된다.
- 전송 중 (In Transit): 모든 데이터 전송은 TLS/SSL을 통해 암호화하여 중간자 공격을 방지한다.
### Fine-Grained Access Control (세분화된 접근 제어)
[[Lake Formation]]을 사용하여 테이블 · 칼럼 · 행 수준의 권한을 정의하고, 이를 [[Athena]] · [[EMR]] 등의 분석 엔진에 일관되게 적용하여 민감 정보(PII)를 안전하게 보호한다.
## 예시
### PII 데이터의 보호 및 통제
1. 요구 사항: 분석가 A는 고객 ID와 구매 내역은 볼 수 있지만, 주민등록번호 칼럼은 볼 수 없어야 한다.
2. 솔루션:
     암호화: 데이터는 [[S3]]에 SSE-KMS로 암호화하여 저장한다.
     접근 제어: [[Lake Formation]]을 사용하여 분석가 A의 [[IAM]] 역할에 대해 해당 테이블의 특정 PII 칼럼만 제외하는 권한을 부여한다.
3. 결과: 분석가는 [[Athena]]에서 쿼리 시 자동으로 PII 칼럼이 마스킹되거나 보이지 않게 되어, 보안 규정 준수(Compliance)를 유지하며 분석을 수행할 수 있다.
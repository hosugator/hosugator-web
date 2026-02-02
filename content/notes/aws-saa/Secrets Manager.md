---
created: 2025-11-12
tags: [aws_saa, secretsmanager, rotation, credential, kms, apikey]
reference:
  - https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
---

# AWS Secrets Manager
## 정의
데이터베이스 비밀번호, API 키, OAuth 토큰 등 민감 정보를 암호화하여 저장하고 자주 바꾸는 관리형 생명주기 서비스

## 핵심 용어
- [[Secret]] : 64KB 이하 문자열 또는 바이너리, KMS 고객 관리 키로 암호화
- [[Rotation]] : Lambda 함수로 주기적 비밀 갱신(기본 30일)
- [[Version Stage]] : AWSCURRENT·AWSPENDING·AWSPREVIOUS 태그로 버전 관리

## 주요 기능
- RDS, DocumentDB, Redshift 전용 로테이션 템플릿 제공
- VPC 엔드포인트로 퍼블릭 인터넷 없이 접근 가능
- Batch GetSecretValue API로 20개 비밀 한 번 조회
- 리전 간 복제 및 다중 리전 백업 지원

## 특징
- 요금 : 비밀 1개월당 0.4USD + API 호출 0.05USD/10,000건
- CloudTrail, 리소스 정책, IAM 조건키로 세분화 권한 제어
- Parameter Store(고급) 대비 생명주기·회전 기능 강화
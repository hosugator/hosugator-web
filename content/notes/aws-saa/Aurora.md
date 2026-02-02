---
created: 2025-11-12
tags:
  - aws_saa
  - aurora
  - rds
  - storage
  - replica
  - parallel
reference:
  - https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html
  - "[[Aurora Shared Cluster Volume]]"
---

# Amazon Aurora
## 정의
MySQL·PostgreSQL 호환 엔진 위에 구축된 AWS 클라우드 네이티브 관계형 데이터베이스로 고성능·고가용성·자동 확장을 제공하는 RDS 상위 서비스

## 핵심 아키텍처
- [[Storage Layer]] : SSD 기반 분산 볼륨, 3-AZ 에 6-복제본 동기 저장
- [[Parallel Query]] : 스토리지 노드에서 직접 스캔·집계 가속
- [[Aurora Replica]] : 최대 15개, 지연 100ms 내, 자동 장애 조치 지원
- [[Serverless v2]] : 인스턴스 용량 0.5~256 ACU 범위로 초당 요금

## 장점
- 기준 성능 MySQL 대비 최대 5배, PostgreSQL 대비 최대 3배
- 스토리지 자동 확장(10GB → 128TB), 백프레셔 없음
- 인스턴스 재시작 없이 즉시 스케일 업/다운
- 연속 백업·지속 복제·PITR 기본 포함

## 제약
- 바이너리 로그 기반 외부 복제만 지원, SUPER 권한 제한
- 전용 클러스터 엔드포인트 외 읽기 전용 엔드포인트 제공
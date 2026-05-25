---
created: 2025-11-12
tags: [aws_saa, rds_backup, snapshot, pitr, retention]
reference:
  - https://docs.aws.amazon.com/rds/latest/UserGuide/USER_WorkingWithAutomatedBackups.html
---

# Amazon RDS Backup & Snapshot
## 정의
RDS 인스턴스를 복구 가능한 시점으로 되돌리기 위한 자동 백업 및 수동 스냅샷 기능

## 자동 백업
- [[Point-in-Time Recovery (PITR)]] : 지정된 보관 기간 내 임의 시점(최대 5분 단위) 복원
- 백업 윈도우 : 30분(default) 동안 스토리지 스냅샷 + 트랜잭션 로그 캡처
- 보관 기간 : 1–35일(기본 7일), Multi-AZ 필수 아님
- 저장 위치 : S3(고객 접근 불가), 리전 내 중복

## 수동 스냅샷
- 사용자가 원하는 시점에 명시적 생성
- 보관 기간 무제한, S3로 직접 복사 가능
- 스냅샷 공유 : 다른 AWS 계정 또는 공개 가능
- 스냅샷 복원 → 새 DB 인스턴스 생성(기존 인스턴스 교체 불가)

## 특징
- 백업·스냅샷 모두 스토리지 요금 별도 청구
- 자동 백업 비활성 시 PITR 불가 (스냅샷만으로는 초 단위 복원 불가)
- Aurora는 자동 백업 1–35일 + 연속 백업(중단 불가) 별도
---
created: 2026-01-27 11:02
tags:
  - aws
  - storage
  - backup
  - retention
  - best-practice
  - 
updated: 2026-02-14 20:24
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# AWS Data Retention Strategy

## 본질 (Essence)
자주 쓰는 물건은 방 안의 작은 서랍(자체 백업)에 두고, 오래 보관할 짐은 전문 창고(AWS Backup/S3)에 맡기는 관리 원칙.

## 구조 (Mechanism)
- 정의: 서비스별 단기 복구 기능과 전사적 장기 보존 솔루션을 결합한 데이터 생명 주기 관리 체계.
- 핵심: 
    - 단기/자체 정책: RDS/Aurora(최대 35일), EBS(스냅샷), EFS(백업 기능) 등 서비스 내부에서 빠른 복구를 위해 제공하는 기본 기능.
    - 장기/전문 솔루션: 자체 정책의 한계(예: 35일)를 넘어서는 규정 준수(5~10년 보관)를 위해 AWS Backup(중앙 관리)이나 S3 Glacier(아카이빙)를 활용하는 대원칙.
    - S3 Lifecycle: 유일하게 서비스 자체적으로 객체의 생애 주기(이동, 삭제)를 자동화하는 고도로 최적화된 예외적 기능.

## 확장 (Connection)
- 연결: 휘발성인 RAM(단기)과 비휘발성인 HDD(장기)의 계층 구조, 혹은 임시 보관소와 국가 기록원의 역할 분담.
- 응용: 24/7 가동되는 DB나 파일 시스템은 운영 중엔 자체 백업을 쓰되, '5년 보관' 같은 법적 요구사항이 등장하면 즉시 AWS Backup 정책을 결합하여 운영 오버헤드를 최소화함.

---
See Also: 
- 
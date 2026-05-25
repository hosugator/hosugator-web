---
created: 2025-11-12
tags: [aws_saa, s3_storage_class, lifecycle, glacier, cost]
reference:
  - https://docs.aws.amazon.com/s3/latest/userguide/storage-class-intro.html
---
# Amazon S3 Storage Classes
## 정의
데이터 액세스 빈도와 내구성·비용 요구에 따라 선택 가능한 six-tier 저장소 유형
## 클래스 비교
| 클래스 | 액세스 빈도 | 최소 청구 기간 | 내구성 | 활용 시점 |
| --- | --- | --- | --- | --- |
| S3 Standard | 즉시 자주 | 없음 | 99.999999999% | 일반 워크로드 |
| S3 Standard-IA | 즉시 가끔 | 30일 | 99.999999999% | DR·백업 |
| S3 One Zone-IA | 즉시 가끔 | 30일 | 99.999999999%(단일 AZ) | 재해 복구 불필요 |
| S3 Glacier Instant | 즉시 드물게 | 90일 | 99.999999999% | 아카이브 but 즉시 |
| S3 Glacier Flexible | 분~시간 드물게 | 90일 | 99.999999999% | 장기 아카이브 |
| S3 Glacier Deep | 12시간↑ 거의 없음 | 180일 | 99.999999999% | 7년 이상 보관 |
## 전환 수단
- [[Lifecycle Rule]] : 객체 나이 또는 버전 기준 자동 전환·삭제
- 수동 `COPY`/`PUT` 시 클래스 지정 가능
## 특징
- 모든 클래스 동일 API·버킷 공용
- 요금 = 저장 + 액세스 + 검색(복원) + 최소 기간
- Glacier 계열은 검색 프로비저닝 시간 선택(Expedited~Bulk)
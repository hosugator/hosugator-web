---
created: 2025-11-26
tags: [aws_saa, s3_class, cost_optimization, s3_standard, s3_ia, s3_glacier, durability, retrieval_cost]
reference:
  - "[[Cost-Optimized Storage Solutions]]"
  - "[[S3]]"
---
# S3 Storage Classes Comparison (S3 스토리지 클래스 비교)
## 정의
[[S3]]가 제공하는 다양한 스토리지 클래스들의 비용 · 접근 빈도 · 내구성 · 가용성 등을 비교하여 데이터 수명 주기에 맞는 최적의 클래스를 선택하는 비용 최적화 전략
## 요소
- Hot-Access: [[S3 Standard]] · [[S3 Intelligent-Tiering]].
- Warm-Access: [[S3 Standard-IA]] · [[S3 One Zone-IA]] (Infrequent Access)
- Cold-Access: [[S3 Glacier Instant Retrieval]] · [[S3 Glacier Flexible Retrieval]] · [[S3 Glacier Deep Archive]].
## 원리
### Durability vs Availability Zone (내구성 vs 가용 영역)
모든 클래스는 11-9s의 극강한 내구성(Durability)을 보장하지만, [[S3 One Zone-IA]]만 데이터를 단일 가용 영역(Single-AZ)에 저장하여 가용성(Availability)은 낮추고 비용을 절감한다.
### Cost Structure Trade-off (비용 구조 트레이드오프)
저장 클래스가 낮아질수록(Cold Tier) 월별 저장 비용은 급격히 저렴해지나, 객체 접근(Retrieval) 비용과 최소 저장 기간 등의 제약 사항이 증가한다.
## 특징
### Intelligent-Tiering for Unknown Access (불확실한 접근 패턴을 위한 Intelligent-Tiering)
데이터 접근 빈도를 자동으로 모니터링하고, 수동 개입 없이 가장 저렴한 접근 계층으로 데이터를 자동으로 이동시켜, 접근 패턴을 예측하기 어려울 때 가장 비용 효율적이다.
### Archive Retrieval Time (아카이브 데이터 검색 시간)
| 클래스 | 접근 빈도 | 가용 영역 수 | 데이터 검색 시간 |
| :--- | :--- | :--- | :--- |
| [[S3 Standard]] | 높음 | 3개 이상 | 즉시(ms) |
| [[S3 Standard-IA]] | 낮음/간헐적 | 3개 이상 | 즉시(ms) |
| [[S3 One Zone-IA]] | 낮음/간헐적 | 1개 | 즉시(ms) |
| [[S3 Glacier Instant Retrieval]] | 매우 낮음 | 3개 이상 | 즉시(ms) |
| [[S3 Glacier Flexible Retrieval]] | 거의 없음 | 3개 이상 | 몇 분 $\sim$ 몇 시간 |
| [[S3 Glacier Deep Archive]] | 장기 보관/거의 없음 | 3개 이상 | 12시간 $\sim$ 48시간 |
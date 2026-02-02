---
created: 2026-01-23
tags:
  - aws
  - billing
  - cost-management
  - cost_explorer
  - athena
  - cur
  - budgets
---
# AWS Cost Management Tools

## 본질 (Essence)
클라우드 사용 비용을 모니터링, 분석 및 통제하여 부서별 예산 수립과 비용 최적화를 지원하는 서비스 모음

## 구조 (Mechanism)
- **AWS Cost Explorer**: 비용 데이터를 시각화하고 필터링(태그, 서비스, 리전 등)하여 사용자 정의 리포트를 생성하는 기본 도구.
- **AWS Budgets**: 설정한 예산 금액을 초과하거나 초과할 것으로 예상될 때 알림을 제공.
- **Cost and Usage Report (CUR)**: 가장 상세한 비용 데이터를 S3에 저장. Athena와 연동하여 복잡한 쿼리 분석 가능.
- **AWS Trusted Advisor**: 비용 절감 기여도가 낮은 리소스(사용하지 않는 탄력적 IP 등)를 찾아내어 최적화 제안.

## 확장 (Connection)
- **연결**: "리포트가 필요하다" = Cost Explorer / "알람이 필요하다" = Budgets / "엄청나게 상세한 SQL 분석이 필요하다" = Athena(CUR).
- **응용**: 부서별 비용 정산이 필요한 경우, 리소스에 부서 태그를 달고 Cost Explorer에서 태그별 리포트를 추출함.

---
See Also: 
- [[Comparison - AWS Budgets vs Cost Explorer vs CUR]]
- [[Athena]]
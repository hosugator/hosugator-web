---
created: 2025-12-22 Mon
tags:
  - comparison
  - architecture
  - serverless
reference:
---
# Comparison - Static Web Hosting Options

## 비교 목적 (Objective)
동적 기능이 없는 웹사이트를 가장 적은 관리 비용으로 고가용성 있게 구축하기 위한 최적의 조합을 선정합니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[S3 + CloudFront]] (A, D) | [[Lambda (C)]] | [[EC2 + ALB (E)]] |
| :--- | :--- | :--- | :--- |
| **운영 오버헤드** | **거의 없음 (Managed)** | 코드 및 트리거 관리 필요 | **매우 높음 (패치/관리)** |
| **확장성** | 글로벌 캐싱 (최상) | 요청량에 따른 자동 확장 (상) | 인스턴스 스케일링 필요 (중) |
| **보안 (HTTPS)** | **CloudFront에서 기본 제공** | 별도 설정 필요 | ALB에서 설정 필요 |
| **적합성** | **정적 사이트의 표준** | API 처리 등에 적합 | 복잡한 CMS 앱에 적합 |

## 선택 기준 및 로직 (Selection Criteria)

### [[S3 + CloudFront]]를 선택해야 하는 경우
* **조건:** 업데이트가 잦지 않고(연 4회), 동적 로직이 없으며, 서버 관리를 완전히 피하고 싶을 때

### [[Lambda]]를 선택해야 하는 경우
* **조건:** 사용자의 입력값에 따라 결과가 변하는 복잡한 연산이 필요한 경우 (이 문제에선 불필요)

---
**Conclusion:**
서버(EC2)도 코드(Lambda)도 필요 없는 **S3 + CloudFront**가 가장 완벽한 정적 솔루션입니다.
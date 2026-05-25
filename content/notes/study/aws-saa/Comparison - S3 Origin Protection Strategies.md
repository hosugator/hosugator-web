---
created: 2025-12-22 Mon
tags:
  - comparison
  - cloudfront
  - s3
  - security
reference:
  - "[[Amazon CloudFront Origin Access Identity]]"
---
# Comparison - S3 Origin Protection Strategies

## 비교 목적 (Objective)
S3 버킷의 데이터를 직접 노출하지 않고 CloudFront 배포를 통해서만 안전하게 제공하는 방법을 결정합니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Public S3 Bucket]] | [[OAI / OAC]] (D) |
| :--- | :--- | :--- |
| **S3 직접 접근** | 누구나 가능 (URL만 알면 노출) | **불가능 (Access Denied 발생)** |
| **보안성** | 낮음 (데이터 유출 위험) | **높음 (인가된 경로만 허용)** |
| **설정 방식** | 버킷 퍼블릭 액세스 허용 | **OAI 생성 및 버킷 정책 적용** |
| **표준 여부** | 비권장 방식 | **AWS 권장 표준 방식** |

## 선택 기준 및 로직 (Selection Criteria)

### [[Origin Access Identity (OAI)]]를 선택해야 하는 경우
* **조건:** S3 버킷을 오리진(Origin)으로 사용하며, S3 URL을 통한 직접 우회를 차단하고 싶을 때
* **참고:** 최근에는 OAI보다 더 강력한 보안 기능을 제공하는 **OAC(Origin Access Control)**가 권장되지만, 시험 보기에서는 여전히 OAI가 정답으로 자주 등장합니다.

---
**Conclusion:**
OAI는 CloudFront 전용 '출입증'과 같습니다. 이 출입증이 있는 CloudFront만 S3 버킷에 들어갈 수 있게 설정하는 것이 보안의 핵심입니다.
---
created: 2025-12-22 Mon
tags: [comparison, decision_making]
reference:
  - "[[SSE-S3]]"
  - "[[SSE-KMS]]"
  - "[[S3 Bucket Keys]]"
---
# Comparison - S3 Server-Side Encryption Methods

## 비교 목적 (Objective)
데이터 보안 요구사항과 운영 예산, 성능 목표에 따라 가장 적절한 S3 암호화 방식을 선정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[SSE-S3 (AES-256)]] | [[SSE-KMS]] | [[S3 Bucket Keys]] |
| :--- | :--- | :--- | :--- |
| **키 관리 주체** | S3 서비스가 완전 관리 | KMS(사용자 또는 AWS 관리) | SSE-KMS의 확장 기능 |
| **보안 통제** | 키 접근 제어 불가 | 키 사용 권한(IAM/Key Policy) 제어 가능 | SSE-KMS와 동일한 보안 수준 |
| **비용/성능** | 추가 비용 없음 | **객체당 KMS API 호출 발생 (비용↑)** | **KMS API 호출 99% 절감 (비용↓)** |
| **운영 오버헤드** | 최저 (기본 설정) | 보통 | 낮음 (SSE-KMS의 최적화 옵션) |

## 선택 기준 및 로직 (Selection Criteria)

### [[SSE-S3]]를 선택해야 하는 경우
* **조건:** 암호화는 필요하지만 특정 키에 대한 세밀한 접근 제어나 감사 기능이 필요 없는 경우
    * *Ex:* 일반적인 로그 저장 및 표준 보안 준수

### [[SSE-KMS]]를 선택해야 하는 경우
* **조건:** 특정 사용자나 서비스만 데이터에 접근하도록 키 정책을 관리해야 하거나, 키 사용 내역을 감사(CloudTrail)해야 하는 경우
    * *Ex:* 금융 데이터나 개인정보 등 엄격한 거버넌스가 필요한 데이터

### [[S3 Bucket Keys]]를 선택해야 하는 경우
* **조건:** **SSE-KMS를 사용하면서** 수백만 건 이상의 대규모 트래픽이 발생하여 KMS 비용과 성능 병목을 해결해야 하는 경우
    * *Ex:* 수백만 개의 이미지를 실시간으로 분석 서버로 전송하는 파이프라인

---
**Conclusion:**
보안 통제가 필요하면 SSE-KMS를 쓰되, 비용과 성능이 걱정된다면 반드시 Bucket Key를 활성화해야 합니다.
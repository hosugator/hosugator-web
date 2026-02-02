---
created: 2026-01-16
tags:
  - aws
  - iam
  - role
  - mechanism
  - policy
  - sts
  - access_key
---
# IAM Role Internal Mechanism

## 본질 (Essence)
영구적인 신뢰 문서(Trust Policy)를 기반으로, 검증된 주체에게만 유효 기간이 짧은 임시 입장권을 발행해주는 자동 발권 시스템

## 구조 (Mechanism)
- **신뢰 정책 (Trust Policy)**: Role의 주인을 정의함. 외부 계정 ID, 특정 서비스 명칭 등을 기입하여 '누구'인지 식별하는 기준이 됨.
- **권한 정책 (Permission Policy)**: Role의 능력을 정의함. IAM Policy 형식을 빌려 리소스에 대한 허용/거부 액션을 규정함.
- **임시성**: 실제 접근에 사용되는 자격 증명은 STS를 통해 생성되며, 탈취되어도 시간이 지나면 무용지물이 됨.

## 확장 (Connection)
- **연결**: 주체가 키를 보관하지 않는다는 점에서, 지문 인식을 통해 잠시 열리는 스마트 도어락의 '임시 비밀번호' 생성 원리와 유사함
- **응용**: 하드코딩된 Access Key를 제거하고 모든 서비스 간 통신을 Role 기반으로 교체하는 것이 보안의 최우선 과제임

---
See Also: 
- [[IAM Role]]
- [[AWS STS]]
- [[Double Check Mechanism]]
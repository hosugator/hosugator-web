---
created: 2025-11-11
tags: [aws_saa, iam, security, principal, policy, role]
reference:
  - https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
---

# AWS Identity and Access Management (IAM)
## 정의
AWS 리소스에 대한 접근 권한을 안전하게 제어하는 관리형 ID 서비스

## 구성 요소
- [[Principal]] : IAM 사용자(User), 그룹(Group), 역할(Role)
- [[Policy]] : 허용 또는 거부를 명시한 JSON 문서
- [[Credential]] : 액세스 키, 비밀 액세스 키, 세션 토큰

## 특징
- 기본 닫힌 모델(Explicit Allow 필요)
- 조직 단위 [[Organizations]]와 연동해 SCP로 경계 설정 가능
- 모든 API 호출은 IAM 권한 평가를 거침
- MFA 및 임시 보안 토큰 지원
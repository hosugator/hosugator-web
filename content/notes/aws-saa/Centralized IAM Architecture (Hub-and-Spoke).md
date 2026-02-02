---
created: 2026-01-16
tags:
  - AWS
  - Architecture
  - IAM
---
# Centralized IAM Architecture (Hub-and-Spoke)

## 본질 (Essence)
사용자 관리(Hub)와 권한 실행(Spoke)을 분리하여 보안성과 운영 효율성을 극대화하는 멀티 계정 전략

## 구조 (Mechanism)
- **Identity Hub**: 모든 IAM User를 한곳에서 관리. 중앙에서 입사/퇴사/부서 이동에 따른 신원 통제 수행.
- **Resource Spoke**: 서비스 리소스가 위치한 계정. User 없이 Role만 존재하며, Hub 계정의 신뢰된 사용자에게만 AssumeRole 허용.
- **Switch Role**: 사용자가 로그인 상태를 유지하며 다른 계정의 Role로 권한을 전환하는 메커니즘.

## 확장 (Connection)
- **연결**: 통합 ID(SSO) 시스템을 통해 사내 포털 한 곳에서 여러 업무 시스템에 접속하는 방식과 유사함
- **응용**: 기업용 AWS 환경인 'AWS Control Tower'나 'IAM Identity Center'가 이 구조를 자동화하여 제공함

---
See Also: 
- [[AWS STS]]
- [[IAM Role]]
- [[AWS Organizations]]
---
created: 2025-12-30
tags: [Security, Identity, Governance, IAM, AWSOrganizations]
---
# Centralized Identity Management in AWS

## 요약 (Summary)
중앙화된 ID 저장소에서 사용자를 식별하고, 각 AWS 계정으로 진입할 때 사전에 매핑된 권한 세트를 동적으로 부여하는 통합 인증 체계

## 배경 (Background)
- 탄생 배경: 다중 계정 환경에서 계정마다 IAM 유저를 생성할 경우, 로그인 정보가 파편화되어 인원 식별이 어렵고 퇴사자 발생 시 권한 회수가 누락되는 보안 허점이 존재했다.
- 핵심 과제: 개별 계정의 아이디/패스워드 없이, 어떻게 단일 로그인(SSO)만으로 수많은 계정의 서로 다른 권한을 안전하게 통제할 것인가?

## 솔루션 (Solution)
- 핵심 설계: IAM Identity Center를 통해 "사용자/그룹 + 대상 계정 + 권한 세트"를 3자 결합(Assignment)하는 구조를 도입한다.
- 작동 메커니즘: 
	 - 중앙 로그인: 사용자는 개인별 I.C 아이디로 중앙 포털에 로그인하여 신원을 증명한다.
	 - 역할 대여(Role Assumption): 특정 계정 클릭 시, I.C가 해당 계정 내에 정의된 IAM Role을 빌려 쓸 수 있는 임시 토큰을 발행한다.
	 - 권한 자동화: Permission Set에 정의된 정책이 대상 계정 내에서 실제 실행 권한이 되어 사용자를 제어한다.

## 변별점 (Distinction)
- 비유: 각 방(계정)마다 개별 열쇠(IAM User)를 만드는 대신, 중앙 로비(I.C)에서 신분 확인 후 해당 방에서만 쓸 수 있는 마스터키(Role)를 일시 대여해주는 호텔 시스템과 같다.
- 대안과의 차이: 
	 - [Individual IAM Users]: 계정별로 로그인 정보가 달라 관리가 불가능에 가깝다.
	 - [IAM Identity Center]: 중앙 포털에서 한 번만 로그인하면 되며, 로그에 '누가' 어떤 역할을 빌려 썼는지 실명이 기록되어 추적성이 압도적이다.

---
See Also:
- [[AWS Organizations]]
- [[AWS Directory Service]]
- [[Permission Sets]]
- [[Role Assumption]]
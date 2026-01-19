---
created: 2025-11-13
tags: [aws_saa, controltower, landingzone, guardrail, blueprint, multiaccount]
reference:
  - https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html
---
# AWS Control Tower
## 정의
[[Organizations]] 위에서 조직 단위 계정 생성·관리·감사를 자동화하고 일관된 보안·거버넌스 기준을 제공하는 관리형 서비스
## 핵심 용어
- [[Landing Zone]] : 조직 최초 설정 결과(OU, 계정, SCP, 로그·공유 계정 포함)
- [[Guardrail]] : 허용 또는 거부 규칙으로 분류, 강제·선택 가능, SCP·Config Rule로 구현
- [[Account Factory]] : 표준화된 계정 생성 워크플로(OIDC·Lambda 기반)
- [[Blueprint]] : 네트워크, 보안, 감사 설정 템플릿
## 주요 기능
- 자동 OU 생성(Security, Sandbox, Shared 서브) 및 SCP 배포
- 강제 Guardrail 예시 : CloudTrail 활성화, 리전 차단, 루트 사용자 MFA
- 선택 Guardrail 예시 : EC2 공인 IP 제한, S3 버킷 공개 차단
- 계정 생성 시 네트워크(VPC, 서브넷), IAM 역할, Config Rule 자동 삽입
- 대시보드에서 Guardrail 위반 현황·계정 프로비저닝 상태 한눈에 확인
## 특징
- 요금 : Control Tower 자체는 무료, 생성된 Config Rule·CloudTrail·S3·VPC는 실제 사용량 과금
- 기존 Organizations 위에 올리며, 이후 OU·SCP는 Control Tower 콘솔에서만 관리 권장
- Landing Zone 업데이트 시 신규 Guardrail·Blueprint 자동 조직 전체 배포
- 조직 단위 API 제공으로 대량 계정 생성·이관 가능
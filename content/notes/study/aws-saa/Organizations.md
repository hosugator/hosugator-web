---
created: 2025-11-13
tags: [aws_saa, organizations, ou, scp, consolidatedbilling, multiaccount]
reference:
  - https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html
---
# AWS Organizations
## 정의
하나의 마스터 계정이 여러 AWS 계정을 계층적으로 관리하고 정책과 결제를 통합할 수 있는 관리형 멀티 계정 서비스
## 핵심 용어
- [[Organization]] : 최상위 컨테이너, 반드시 하나의 마스터 계정 존재
- [[Organizational Unit (OU)]] : 계정을 담는 폴더, 중첩 가능(트리 구조)
- [[Service Control Policy (SCP)]] : 계정·OU에 부착하는 허용/거부 규칙, IAM 경계 역할
- [[Consolidated Billing]] : 맴버 계정 요금을 마스터로 집계, 볼륨 할인 효과
- [[Account Factory]] : 표준화된 계정 생성 워크플로(OIDC·Lambda 기반)
## 주요 기능
- SCP로 리전 차단, 인스턴스 타입 제한, 민감 서비스 거부 가능
- 전체 조직 단위 AWS Artifact 보고서, CUR(비용 사용 보고서) 통합
- AWS SSO(현 IAM Identity Center) 연동으로 중앙 집중식 사용자 프로비저닝
- API/CLI로 계정 대량 생성, 이메일·결제 정보 자동 설정
## 특징
- 요금 : Organizations 자체는 무료, SCP 적용 시 맴버 계정당 월 추가 비용 없음
- 마스터 계정은 SCP 자신에게 적용 불가(보호)
- 조직 생성 후 멤버 계정은 조직 탈퇴 또는 삭제 필요
- 조직 단위 AWS Control Tower 통해 랜딩존·가드레일 자동 적용 가능
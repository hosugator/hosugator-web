---
created: 2025-11-13
tags: [aws_saa, securityhub, findings, standards, compliance, aggregation]
reference:
  - https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html
---
# AWS Security Hub
## 정의
GuardDuty, Inspector, Macie, Config 등 다양한 보안 서비스의 진단 결과(Finding)를 하나의 대시보드로 집계·우선순위화·자동 대응할 수 있는 중앙 관리형 보안 허브 서비스
## 원리
- 각 서비스가 생성한 [[Finding]] 을 EventBridge를 통해 Hub로 모음
- AWS 보안 기준(CIS AWS Foundations, PCI-DSS, ISO 27001) 자동 준수 점검
- 중복 Finding 통합, 심각도·리소스 태그 기준 우선순위 정렬
- 결과를 [[EventBridge]] → Lambda/SNS로 전달해 자동 치료 워크플로 실행
## 특징
- 조직 전체 멀티 계정·멀티 리전 Finding 통합 가능
- 30일간 Finding 보관, S3 백업 옵션
- Custom Action : 콘솔에서 선택한 Finding에 대해 Lambda 함수 트리거
- Security Score : 0-100점으로 조직 보안 상태 한눈에 확인
- API/CLI로 외부 SIEM/SOAR 도구에 연동 가능
## 비교
[[GuardDuty]] 는 침입, [[Inspector]] 는 취약성, [[Macie]] 는 데이터 민감도,  
Security Hub는 모든 보안 Finding을 한곳에 모아 우선순위와 조치를 도와주는 총괄 허브
## 예시
1. GuardDuty 악성 IP 3건, Inspector Critical 2건, Config 루트 MFA 미사용 1건 동시 도착
2. Security Hub 대시보드에서 6건 Finding 통합, 심각도 순으로 정렬
3. Custom Action 버튼 클릭 → EventBridge → Lambda → 침입 IP 자동 차단 및 지라 티켓 생성
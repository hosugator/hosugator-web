---
created: 2025-11-11
tags: [aws_saa, inspector, vulnerability, ec2, ecr, security]
reference:
  - https://docs.aws.amazon.com/inspector/
  - https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html
---
# Amazon Inspector
## 정의
자동 취약성 스캔과 심각도 분류를 제공하는 관리형 보안 평가 서비스
## 원리
- [[EC2]] 인스턴스 내부 파일 시스템과 소프트웨어 인벤터리 수집
- 수집 결과를 [[CVE]], [[CVSS]] 데이터베이스와 비교해 이슈 탐지
- 탐지 결과를 [[EventBridge]], [[Security Hub]], [[SNS]] 로 실시간 전파
## 특징
- [[EC2]] 와 [[ECR]] 컨테이너 이미지 모두 스캔 대상
- [[CVSS]] 점수 기반 5단계 심각도 자동 분류
- 지속적 모니터링 옵션으로 신규 취약성 발표 시 자동 재평가
- [[Organizations]] 기반 멀티 계정·리전 통합 대시보드
## 비교
보안 경보 및 규정 준수 중심인 [[Security Hub]], [[GuardDuty]], [[Macie]] 는 취약성 스캔 기능을 Inspector 에 위임  
"취약성 탐지 + 심각도 분류" 요구사항을 충족하는 네이티브 서비스
## 예시
1. [[ECR]] 에 새 이미지 푸시 → [[EventBridge]] 규칙 트리거 → Inspector 자동 스캔
2. 결과 Critical 3건, High 12건 → [[SNS]] → Slack 알림
3. 개발팀은 Inspector 콘솔에서 [[CVE]] 설명과 권장 패치 확인 후 파이프라인에 반영
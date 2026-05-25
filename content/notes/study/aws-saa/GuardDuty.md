---
created: 2025-11-13
tags: [aws_saa, guardduty, threat, intrusion, anomaly, finding]
reference:
  - https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html
---
# Amazon GuardDuty
## 정의
지속적인 위협 탐지 서비스로, 로그와 네트워크 트래픽을 실시간 분석해 침입·악성 행위를 자동으로 발견·조치 돕는 관리형 보안 서비스
## 원리
- [[CloudTrail]] 이벤트, [[VPC]] Flow Logs, DNS 쿼리 로그를 수집
- ML 기준 모델과 위협 인텔리전스 피드(악성 IP, 도메인)로 이상 징후 탐지
- 탐지 시 [[Finding]] 생성, 심각도(Low·Medium·High) 및 공격 유형 분류
- 결과를 [[Security Hub]], [[EventBridge]] 로 전달
## 특징
- 30분 내 위협 탐지, false positive 최소화를 위한 기준 학습
- 50가지 이상 공격 유형 : 포트 스캔, 암호화폐 채굴, 악성 DNS, IAM 이상 행위 등
- 조직 전체 멀티 계정·멀티 리전 통합 대시보드
- 자동 치료 : EventBridge → Lambda로 자동 차단, 보안 그룹 변경, IAM 키 폐기
## 비교
[[Inspector]] 는 취약성, [[Macie]] 는 데이터 민감도,  
GuardDuty는 실시간 침입·이상 행위를 ML 기반으로 탐지하는 서비스
## 예시
1. 새 인스턴스에 대한 포트 스캔 1,200회/5분 감지
2. Finding 심각도 High, 공격 IP는 악성 목록 포함
3. EventBridge → Lambda → 보안 그룹 inbound 차단 규칙 자동 추가 후 Slack 알림
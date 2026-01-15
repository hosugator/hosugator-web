---
created: 2025-12-19
tags:
  - aws
  - cloudwatch
  - monitoring
  - observability
reference:
  - "[[Amazon CloudWatch Composite Alarms]]"
  - "[[Amazon CloudWatch Logs]]"
---

# Amazon CloudWatch

## 정의 (Definition)
AWS 리소스와 애플리케이션에서 발생하는 지표, 로그, 이벤트를 실시간으로 수집하고 시각화하여 전체 시스템의 상태를 감시하는 모니터링 및 관찰 서비스

## 핵심 맥락 (Context & Why)
### Problem
수많은 리소스로 구성된 클라우드 환경에서 각 인스턴스나 서비스의 성능 상태를 개별적으로 확인하는 것은 불가능하며, 문제 발생 시 원인을 파악하기 위한 통합된 데이터 뷰가 부재합니다.
### Solution
시스템 전체의 메트릭(지표)을 중앙에서 관리하고, 임계치 초과 시 자동 알람을 보내거나 리소스를 조절하는 트리거 역할을 수행하여 운영 가시성을 확보합니다.

## 작동 원리 (Mechanism) 
### 데이터 수집
AWS 서비스로부터 지표를 자동 수집하거나 CloudWatch 에이전트를 통해 OS 내부의 커스텀 데이터를 수집합니다.
### 모니터링 및 시각화
수집된 데이터를 대시보드로 구성하여 실시간 추세를 확인하고 통계 데이터를 분석합니다.
### 알람 및 조치
설정한 조건이 만족되면 알람이 발생하며, SNS 알림 발송이나 Auto Scaling 트리거와 같은 자동화된 대응을 실행합니다.

## 유비 및 비교 (Analogy & Comparison)
### It's like
자동차 계기판과 블랙박스의 역할을 동시에 수행하여 차의 현재 속도나 연료 상태를 보여주고 사고 시 기록을 남기는 것과 같습니다.
### vs (유사 개념)
- Amazon CloudWatch: AWS 내부 리소스의 성능 지표와 로그 모니터링에 집중합니다.
- AWS CloudTrail: AWS 계정 내에서 발생한 API 호출 내역(누가 무엇을 했는지)을 기록하는 감사 도구입니다.

---
See Also:
- [[Amazon CloudWatch Metrics]]
- [[Amazon CloudWatch Composite Alarms]]
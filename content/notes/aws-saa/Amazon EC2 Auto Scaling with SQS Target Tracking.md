---
created: 2025-12-18
tags:
  - aws_saa
  - auto_scaling
  - sqs
  - performance_optimization
  - target_tracking
reference:
  - "[[Amazon SQS]]"
  - "[[Amazon EC2 Auto Scaling]]"
---
# Amazon EC2 Auto Scaling with SQS Target Tracking

## 정의 (Definition)
SQS 대기열에 쌓인 메시지 수를 기반으로 처리 계층의 EC2 인스턴스 개수를 자동으로 조절하여 성능 지연을 방지하는 확장 전략

## 핵심 맥락 (Context & Why)
- Problem: 피크 시간이 불규칙한 환경에서 CPU 사용량만으로 확장할 경우, 이미 SQS 대기열이 가득 차서 사용자 지연이 발생한 뒤에야 뒤늦게 서버가 늘어나는 지연 반응 문제가 발생함
- Solution: 시스템의 부하가 실제 서버에 도달하기 전 단계인 SQS 대기열의 크기를 모니터링하여 선제적이고 직접적인 확장을 수행함

## 작동 원리 (Mechanism) 
- 지표 수집: CloudWatch가 SQS의 ApproximateNumberOfMessages(대기 중인 메시지 수) 속성을 실시간으로 추적함
- 타겟 트래킹: 사용자가 설정한 인스턴스당 적정 메시지 수(예: 대당 10개)를 유지하기 위해 Auto Scaling 그룹이 인스턴스를 즉시 추가하거나 제거함

## 유비 및 비교 (Analogy & Comparison)
- It's like: 식당 주방장이 요리를 시작한 뒤에 사람을 뽑는 것이 아니라, 식당 입구에 대기 줄이 길어지는 것을 보고 즉시 보조 요원을 투입하는 것
- vs CPU Utilization Tracking: 
	 - Amazon EC2 Auto Scaling with SQS: 작업의 원천인 대기열을 직접 관리하므로 응답 속도 최적화에 유리함
	 - CPU Utilization Tracking: 이미 서버 부하가 한계치에 도달한 후 확장되므로 급격한 트래픽 변동에 대응이 늦을 수 있음

## 예시 및 구조 (Example/Structure)
온라인 쇼핑몰 주문 처리 시스템에서 SQS 대기열에 처리되지 않은 주문이 인스턴스당 평균 100개를 초과할 경우, 대상 추적 정책을 통해 처리용 EC2 인스턴스를 즉시 확장하여 주문 누락 및 지연을 방지함

---
See Also:
- [[Principle of Target Tracking Policy]]
- [[Compositions of Decoupled Architecture]]
---
created: 2025-12-18 15:02
tags:
  - aws_saa
  - auto_scaling
  - sqs
  - performance_optimization
  - target_tracking
  - 
reference:
  - "[[Amazon SQS]]"
  - "[[Amazon EC2 Auto Scaling]]"
updated: 2026-02-15 12:51
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
publish: true
---
# Amazon EC2 Auto Scaling with SQS Target Tracking
## Essence
SQS 대기열의 크기를 모니터링하여, 처리 계층의 EC2 인스턴스 개수를 자동 조절하여 성능 지연을 방지하는 선제적 확장 전략
## Mechanism
- 서버 확장 지연 문제: 피크 시간이 불규칙한 환경에서 CPU 사용량만으로 확장할 경우, 이미 SQS 대기열이 가득 차서 사용자 지연이 발생한 뒤에야 뒤늦게 서버가 늘어나는 지연 반응 문제가 발생함
- 지표 수집: CloudWatch가 SQS의 ApproximateNumberOfMessages(대기 중인 메시지 수) 속성을 실시간으로 추적함
- 타겟 트래킹: 사용자가 설정한 인스턴스당 적정 메시지 수(예: 대당 10개)를 유지하기 위해 Auto Scaling 그룹이 인스턴스를 즉시 추가하거나 제거함
## Analogy
- It's like: 식당 주방장이 요리를 시작한 뒤에 사람을 뽑는 것이 아니라, 식당 입구에 대기 줄이 길어지는 것을 보고 즉시 보조 요원을 투입하는 것
- vs:
	 - CPU Utilization Tracking: 이미 서버 부하가 한계치에 도달한 후 확장되므로 급격한 트래픽 변동에 대응이 늦을 수 있음
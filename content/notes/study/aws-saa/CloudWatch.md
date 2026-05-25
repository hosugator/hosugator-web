---
created: 2025-11-12
tags: [aws_saa, cloudwatch, monitoring, metric, alarm, dashboard]
reference:
  - https://docs.aws.amazon.com/cloudwatch/latest/monitoring/what-is-cloudwatch.html
---
# Amazon CloudWatch
## 정의
AWS 리소스와 애플리케이션의 실시간 성능 지표를 수집·추적·알림하는 관리형 모니터링 서비스
## 핵심 요소
- [[Metric]] : 시간별 수치 데이터(CPUUtilization, RequestCount 등)
- [[Alarm]] : 임계값 초과 시 SNS·Auto Scaling·Lambda 작동
- [[Dashboard]] : 위젯으로 지표·로그를 한눈에 시각화
- [[Log Group / Stream]] : EC2·Lambda·VPC Flow 등 로그 중앙 저장
- [[CloudWatch Agent]] : OS 내부 지표(메모리, 디스크) 수집
## 특징
- 기본 지표 1분 주기 제공(상세 모니터링 활성 시 1분)
- 15개월 메트릭 보관(무료)
- 통합 대시보드로 cross-account·cross-region 조회 가능
- Insights 쿼리 언어로 로그 필터링 및 집계
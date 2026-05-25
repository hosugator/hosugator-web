---
created: 2025-11-26
tags: [aws_saa, cost_optimization, compute, ec2, purchasing_options, serverless, lambda, right_sizing, auto_scaling]
reference:
  - "[[Cost-Optimized Architectural Design]]"
  - "[[EC2]]"
---
# Cost-Optimized Compute Solutions (비용이 최적화된 컴퓨팅 솔루션 설계)
## 정의
컴퓨팅 요구 사항에 따라 [[EC2]] 인스턴스 유형 및 구매 옵션을 선택하고 서버리스 기술을 활용하여 컴퓨팅 자원의 유휴(Idle) 시간 비용을 최소화하는 설계 전략
## 원리
### Consumption Model Matching (소비 모델 일치 원리)
워크로드의 지속성 및 예측 가능성에 따라 가장 저렴한 구매 옵션을 매칭한다.
- 안정적/장기: RI/SP (최대 72% 할인)를 통해 고정 비용 절감.
- 일시적/유연: 스팟 인스턴스 (최대 90% 할인)를 통해 단기 비용 절감.
- 간헐적/이벤트 기반: Lambda (유휴 비용 0)를 통해 사용한 컴퓨팅 시간에 대해서만 지불.
### Horizontal vs. Vertical Scaling (수평적 vs 수직적 확장 원리)
더 큰 인스턴스를 적게 사용하는 수직적 확장 대신, 더 작은 인스턴스를 많이 사용하여 수평적 확장을 구현함으로써 비용 최적화와 동시에 서비스 중단 위험을 감소시키는 접근 방식.
### Right-Sizing and Utilization (적정 규모 조정 및 활용)
[[CloudWatch]] 메트릭을 사용하여 인스턴스의 CPU · 메모리 활용률을 모니터링하고, 과도하게 프로비저닝된 인스턴스를 더 작은 크기로 조정(Right-Sizing)하여 비용을 절감하는 행위.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  [[EC2 Purchasing Options Comparison]] (EC2 구매 옵션 비교)
2.  [[Right-Sizing and Utilization]] (적정 규모 조정 및 활용)
3.  [[Serverless Compute Cost Benefits]] (서버리스 컴퓨팅 비용 이점)
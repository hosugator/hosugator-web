---
created: 2026-01-23
tags:
  - aws
  - compute
  - deployment
  - managed
---
# Elastic Beanstalk

## 본질 (Essence)
코드만 던지면 인프라(EC2, ASG, ALB)를 자동으로 구성하고 관리해주는 '올인원 패키지형 배포 플랫폼'.

## 구조 (Mechanism)
- **완전 관리형**: 용량 프로비저닝, 로드 밸런싱, 스케일링, 상태 모니터링을 AWS가 전담함.
- **다양한 플랫폼**: Java, PHP, Python, Node.js, .NET, Go, Docker 등을 지원.
- **배포 전략**: URL Swapping 기능을 통해 환경 간 트래픽을 즉시 전환(Blue/Green 배포)하여 안정적인 신기능 테스트 가능.

## 확장 (Connection)
- **연결**: 텐트를 직접 치는 것(EC2) 대신 모든 시설이 갖춰진 글램핑장(Beanstalk)을 예약하는 것과 같음.
- **응용**: 문제에서 "운영 오버헤드 최소화"와 함께 "애플리케이션 배포 및 테스트"가 강조될 때 최우선 선택지.

---
See Also: 
- [[URL Swapping]]
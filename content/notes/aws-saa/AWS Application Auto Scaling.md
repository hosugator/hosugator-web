---
created: 2026-01-06
tags:
  - AWS
  - AAS
  - application_auto_scaling
---
# AWS Application Auto Scaling

## 요약 (Summary)
다양한 AWS 개별 서비스 리소스를 사전에 정의한 정책에 따라 자동으로 확장 및 축소하여 최적의 성능과 비용 효율성을 유지하는 관리형 서비스

## 배경 (Background)
- 탄생 배경: 서비스마다 스케일링 방식이 파편화되어 있어 통합된 관리 체계가 필요했고, 트래픽 변화에 따라 수동으로 리소스를 조절하는 방식은 운영 오버헤드와 비용 낭비를 초래함
- 핵심 과제: 관리자가 개입하지 않아도 CPU, 메모리 등의 메트릭 변화에 즉각 대응하여 가용성을 보장하고 유휴 자원을 최소화하는 것

## 솔루션 (Solution)
- 핵심 설계: 대상 추적 정책(Target Tracking), 단계별 조정 정책(Step Scaling), 예약된 조정 정책(Scheduled Scaling)을 통해 리소스 용량을 동적으로 제어
- 작동 메커니즘: CloudWatch가 리소스 메트릭을 감시하다가 설정한 임계치를 넘어서면 알람을 발생시키고, Application Auto Scaling이 이를 수신하여 API 호출을 통해 리소스(ECS Task, DynamoDB Capacity 등)의 수량을 조절함

## 변별점 (Distinction)
- 비유: 건물의 전기 사용량에 따라 자동으로 가동 개수를 조절하는 스마트 중앙 제어 에어컨 시스템
- 대안과의 차이: 
	 - [EC2 Auto Scaling]: EC2 인스턴스(서버) 집합의 크기를 조절하는 데 특화된 반면, Application Auto Scaling은 ECS 서비스, DynamoDB, Lambda 등 다양한 개별 리소스를 광범위하게 지원함
	 - [AWS Lambda(Custom)]: 직접 코드를 짜서 스케일링을 구현할 수 있으나 운영 관리 포인트가 늘어나는 반면, 본 기술은 AWS가 관리하는 네이티브 기능을 사용하여 안정성이 높고 설정이 간편함

---
See Also:
- [[Scaling Comparison]]
---
created: 2025-11-20
tags: [aws_saa, scaling, horizontal_scaling, elasticity, auto_scaling, resilience]
reference:
---
# Horizontal Scaling (수평적 크기 조정)
## 정의
컴퓨팅 로드를 분산하기 위해 기존 서버나 인스턴스에 동일한 리소스를 가진 인스턴스를 추가하는 방식으로 시스템 용량을 확장하는 방법.
## 요소
### Elastic Load Balancer (ELB)
수평적으로 추가된 여러 인스턴스에 인바운드 트래픽을 효율적으로 분산하는 필수적인 구성 요소이다.
### Auto Scaling Group (ASG)
수요 변화에 따라 EC2 인스턴스의 개수를 자동으로 증가(Scale-out)시키거나 감소(Scale-in)시키는 AWS 서비스이다.
### Loose Coupling (느슨한 결합)
각 인스턴스가 서로 독립적으로 작동하며 상태를 공유하지 않도록 설계되어야 수평적 확장이 가능하다.
## 원리
### Scale-out (확장)
수요 증가 또는 성능 지표(CPU 사용률, 네트워크 I/O 등)가 임계값을 초과할 때, ASG가 새로운 인스턴스를 자동으로 시작(Launch)하고 ELB에 등록하여 트래픽을 분산한다.
### Scale-in (축소)
수요 감소 또는 성능 지표가 낮은 임계값으로 떨어질 때, ASG가 불필요한 인스턴스를 자동으로 종료(Terminate)하여 비용을 최적화한다.
### Elasticity (탄력성)
ASG의 자동화된 확장을 통해 수요 변화에 맞춰 용량을 유연하게 조정한다. 이는 AWS Well-Architected Framework의 성능 효율성과 비용 최적화의 핵심 요소이다.
## 특징
### Resilience (복원력)
로드 밸런서 뒤에 여러 인스턴스가 분산되어 있어, 특정 인스턴스 또는 가용 영역(AZ)에 장애가 발생하더라도 나머지 인스턴스가 트래픽을 처리하여 단일 장애 지점을 제거한다.
### Fault Tolerance (내결함성)
시스템이 장애를 자동으로 견디고 복구할 수 있는 능력을 제공하여, 고가용성(High Availability, HA) 아키텍처를 구축하는 데 필수적이다.
### Limitless Scalability (무한한 확장성)
기술적 상한선 없이 인스턴스를 지속적으로 추가할 수 있으므로, 극단적인 대규모 워크로드(Massive Scale) 처리에 적합하다.
### Cost Optimization (비용 최적화)
사용하지 않을 때는 리소스를 축소(Scale-in)하여 비용을 절감하는 종량제(Pay-as-you-go) 모델을 따른다.
## 비교
| 구분 | Horizontal Scaling (수평적 크기 조정) | Vertical Scaling (수직적 크기 조정) |
| :--- | :--- | :--- |
| 방법 | 인스턴스 개수를 늘린다. | 단일 인스턴스의 사양을 높인다. |
| 복원력 | 높음 (자동 내결함성) | 낮음 (단일 장애 지점) |
| 비용 효율 | 우수함 (수요 기반 자동 최적화) | 저하됨 (고가 사양으로 갈수록 비용 가파르게 증가) |
| 적합 워크로드 | 웹/앱 서버, 마이크로서비스, API 백엔드, 분산 시스템 | 레거시 앱, 라이선스 제약이 있는 DB (작은 규모) |
## 예시
### Amazon EC2 Auto Scaling을 사용한 웹 서비스 구축
1. 웹 서비스의 트래픽 급증에 대비하여 EC2 인스턴스를 Auto Scaling Group 내에 배포한다.
2. 대상 추적 조정 정책(Target Tracking Scaling Policy)을 설정하여, 평균 CPU 사용률이 60%를 초과하면 자동으로 인스턴스 개수를 증가(Scale-out)시키도록 구성한다.
3. 모든 인스턴스 앞에 Application Load Balancer (ALB)를 배치하여, 모든 인스턴스에 트래픽이 고르게 분산되도록 보장한다.
4. 야간에 트래픽이 감소하여 CPU 사용률이 20% 미만으로 떨어지면, ASG가 인스턴스를 축소(Scale-in)하여 비용을 절감한다.
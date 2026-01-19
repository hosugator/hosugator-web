---
created: 2025-11-24
tags:
  - aws_saa
  - container
  - ecs
  - eks
  - fargate
  - scaling
  - deployment
  - high_performance
  - decoupling
reference:
  - "[[High-Performing and Elastic Computing Solutions]]"
  - "[[EC2]]"
  - "[[ELB]]"
  - "[[Container Services]]"
---
# Container Scaling and Deployment Architecture (컨테이너 확장 및 배포 아키텍처)

## 정의 (Definition)
[[Container Services]]를 활용하여 애플리케이션의 성능 요구 사항과 트래픽 변동성을 충족시키기 위해, 컨테이너화된 워크로드를 탄력적으로 크기 조정하고 배포하는 설계 전략

## 핵심 맥락 (Context & Why)
 - Problem: [[EC2]]와 같은 VM 기반 환경에서는 트래픽 변동성에 대한 신속한 확장/축소 대응이 느리고, 인프라 관리에 운영 오버헤드가 발생한다.
 - Solution: 컨테이너는 실행 환경을 추상화하고 시작 오버헤드가 낮아 신속한 규모 확장(Rapid Scale-Out)을 가능하게 하며, [[Fargate]]와 같은 서버리스 옵션을 통해 관리 부담을 제거한다.

## 작동 원리 (Mechanism)
 - 독립적 확장 원리 (Independent Scaling): 마이크로서비스 아키텍처에서 각 컨테이너 서비스(Task/Pod)는 독립적으로 크기 조정된다. 한 서비스의 트래픽 급증이 다른 서비스에 영향을 미치지 않아 느슨한 결합과 전체 시스템의 고성능을 유지한다.
 - 로드 밸런싱 통합: [[ELB]]와 통합하여 포트 매핑을 통해 여러 컨테이너 인스턴스 간에 트래픽을 효율적으로 분산하고 고가용성을 확보한다.
 - Auto Scaling: [[ECS]] 및 [[EKS]]의 서비스 스케일링을 통해 컨테이너의 복제본(Task/Pod) 수를 수요에 따라 자동으로 조정한다.

## 유비 및 비교 (Analogy & Comparison)
 - It's like: 레고 블록을 조립하여 건물을 짓는 것과 같다. 컨테이너는 표준화된 블록(이미지)이며, 오케스트레이터(ECS/EKS)는 건물의 크기(확장)와 배치를 관리하는 설계사 역할을 한다.
 - vs [[EC2]]:
	 - Container (Fargate): 운영 오버헤드가 제로이므로, 관리 시간을 절약하여 배포 속도와 비용 효율성을 높이는 데 집중한다.
     - [[EC2]] (자체 관리): OS 수준의 제어, 사용자 지정 커널, 고급 네트워킹 설정 등 세밀한 성능 튜닝 및 제어가 필요할 때 사용된다.

## 예시 및 구조 (Example/Structure)
### 온디맨드 배치 처리 워크로드 (Fargate)
1. 요구 사항: 트래픽이 불규칙하고, 단기간에 대규모 컴퓨팅 파워가 필요하며, 인프라 관리를 최소화해야 하는 배치 작업을 처리해야 한다.
2. 솔루션: [[ECS]]에 Fargate 시작 유형을 선택하여 배치 컨테이너를 실행한다.
3. 결과: 배치 작업이 완료되면 컴퓨팅 리소스가 자동으로 종료되어 유휴 비용이 발생하지 않으며, 개발팀은 서버 관리에 시간 낭비 없이 배치 로직에만 집중할 수 있다.
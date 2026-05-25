---
created: 2025-11-24
tags: [aws_saa, high_performance, elastic_computing, ec2, containers, lambda, auto_scaling, cloudwatch]
reference:
---
# High-Performing and Elastic Computing Solutions (고성능 컴퓨팅 솔루션 설계)
## 정의
현재 및 미래의 요구사항, 성능 목표, 비용 최적화를 충족하기 위해 AWS에서 제공되는 인스턴스, 컨테이너, 함수 세 가지 컴퓨팅 형태를 기반으로 확장 가능하고 탄력적인 아키텍처를 설계하는 활동
## 요소
### AWS Computing Forms (AWS 컴퓨팅 3가지 형태)
- Instances (인스턴스): Amazon [[EC2]] (가상 서버)
- Containers (컨테이너): Amazon [[ECS]], Amazon [[EKS]] (Fargate, EC2 기반)
- Functions (함수): [[Lambda]] (서버리스 코드 실행)
### Scaling & Monitoring Services (확장 및 모니터링 서비스)
- Load Balancer: [[ELB]]
- Auto Scaling: Amazon EC2 [[Auto Scaling]]
- Monitoring: Amazon [[CloudWatch]] (지표, 경보, 대시보드)
## 원리
### Decoupling for Scalability (확장성을 위한 분리)
[[SQS]] 및 ELB와 같은 서비스를 통합하여 워크로드 구성 요소를 독립적으로 확장할 수 있도록 설계한다.
### Elasticity Principle (탄력성 원리)
솔루션의 탄력성(Elasticity)은 설계 방식에 따라 달라지며, 일부 서비스(예: [[Lambda]])는 본질적으로 탄력적인 반면, [[EC2]]는 Auto Scaling 그룹을 통해 탄력성을 확보해야 한다.
### Performance vs. Cost (성능 대비 비용)
요구 사항에 따라 최적의 인스턴스 유형([[EC2 Instance Family]]) 및 컴퓨팅 형태(인스턴스, 컨테이너, 함수)를 선택하여 성능과 비용을 모두 최적화한다.
## 특징
### Instance Characteristics (인스턴스 특징)
[[EC2 Instance Family]]는 CPU, 메모리, 로컬 스토리지, 네트워크 대역폭, GPU 등 다양한 기능으로 구성되며, 각 유형의 성능 영향을 이해하는 것이 중요하다.
### Serverless Advantages (서버리스 이점)
- Lambda: 코드를 실행 환경으로부터 추상화하며, 실행 기간에 대해서만 요금이 청구된다. 실행 제한 시간은 15분이다.
- Fargate (ECS/EKS): 컨테이너용 서버리스 컴퓨팅으로, 컴퓨팅 환경의 설치, 구성 및 관리가 불필요하다.
### Scaling Visibility (확장 가시성)
[[CloudWatch]]의 지표(CPU 사용률, 메모리, ELB 지표 등)를 사용하여 크기 조정 이벤트의 기반을 마련하고, 경보를 통해 자동화, 알림 및 수정을 추가한다.
## 하위 학습 주제 (Sub-Topics)
이 주제를 완전히 이해하기 위해 다음 순서로 원자성 노트를 작성합니다.
1.  EC2 Instance Types and Performance (EC2 인스턴스 유형 및 성능)
2.  Container Computing (ECS, EKS, Fargate)
3.  Serverless Computing (Lambda and Step Functions)
4.  Auto Scaling and Monitoring (CloudWatch, Scaling Metrics)
5.  Comparison - Computing Solutions (EC2 vs. Containers vs. Lambda)
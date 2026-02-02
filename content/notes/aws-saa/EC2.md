---
created: 2025-11-11
tags: [aws_saa, ec2, compute, instance, ami, autoscaling]
reference:
  - https://docs.aws.amazon.com/ec2/latest/UserGuide/concepts.html
---
# AWS EC2 (Elastic Compute Cloud)
## 정의
AWS 클라우드에서 안전하고 크기 조정이 가능한 컴퓨팅 용량을 제공하는 웹 서비스이다. 사용자가 서버 하드웨어를 직접 구매하거나 관리할 필요 없이 가상 인스턴스(Virtual Instance)를 제공한다.
## 요소
### AMI (Amazon Machine Image)
인스턴스를 시작하는 데 필요한 소프트웨어 구성(운영 체제, 애플리케이션 서버 및 애플리케이션)이 포함된 템플릿이다.
### Instance Type (인스턴스 유형)
EC2 인스턴스의 CPU, 메모리, 스토리지 및 네트워킹 용량의 조합을 정의한 것이다. 워크로드에 따라 범용(M), 컴퓨팅 최적화(C), 메모리 최적화(R), 스토리지 최적화(I), 가속화 컴퓨팅(P/G) 등으로 분류된다.
### EBS (Elastic Block Store)
인스턴스에 연결하여 사용할 수 있는 영구적인 블록 스토리지이다. 인스턴스가 종료되어도 데이터가 유지되며, [[IOPS]] 및 처리량에 따라 다양한 유형(gp3, io2 등)이 있다.
### Security Group (보안 그룹)
인스턴스에 대한 방화벽 역할을 수행한다. 인스턴스의 인바운드 및 아웃바운드 트래픽을 제어하여 보안을 강화한다.
## 원리
### 인스턴스 프로비저닝 (Provisioning)
사용자가 원하는 AMI와 인스턴스 유형을 선택하여 EC2 인스턴스를 시작한다. AWS는 요청된 용량에 맞춰 내부적으로 물리 서버에 가상 인스턴스를 생성하여 제공한다.
### 크기 조정
Vertical Scaling은 인스턴스 유형 변경으로, Horizontal Scaling은 Auto Scaling Group(ASG)을 통해 인스턴스 개수를 조정하여 달성한다.
### 탄력성 및 비용
사용자가 인스턴스를 시작(Running)하는 동안에만 요금이 부과되며, 사용하지 않을 때는 중지(Stopped)하거나 종료(Terminated)하여 비용 효율성을 확보한다.
## 특징
### 제어 및 유연성
OS 레벨까지 가장 높은 제어권을 제공한다. 레거시 애플리케이션이나 특정 라이선스 요구 사항이 있는 워크로드에 적합하다.
### 고성능 컴퓨팅 (HPC) 지원
- Placement Groups (배치 그룹): 인스턴스의 물리적 배치 방식을 지정하여 성능을 최적화한다.
    - Cluster: 단일 AZ 내에서 낮은 네트워크 지연 시간을 위해 인스턴스들을 물리적으로 가깝게 배치한다. (HPC에 최적)
    - Spread: 인스턴스들을 서로 다른 하드웨어에 배치하여 최대 복원력을 제공한다. (Critical Application에 최적)
    - Partition: 대규모 분산 및 HDFS와 같은 워크로드를 위해 인스턴스 그룹을 논리적 파티션으로 분할한다.
- Advanced Networking: ENA(Elastic Network Adapter), EFA(Elastic Fabric Adapter)와 같은 고급 네트워킹 옵션을 통해 초고속 처리량과 낮은 지연 시간을 확보한다.
### 결함 격리
Multi-AZ 환경에 인스턴스를 분산 배포하여 가용 영역 장애 시에도 서비스 연속성을 확보한다.
## 비교
| 구분 | EC2 (가상 인스턴스) | AWS Lambda (서버리스) |
| :--- | :--- | :--- |
| 운영 책임 | 높음 (OS 패치, 보안, 스케일링 관리) | 낮음 (코드 실행 환경만 관리) |
| 최대 실행 시간 | 무제한 (인스턴스가 실행되는 동안) | 제한적 (Lambda는 최대 15분) |
| 제어 수준 | OS/하드웨어 레벨의 최고 제어권 | 최소 제어권 (코드와 메모리만 관리) |
| 비용 모델 | 시간당 요금 (유휴 시간에도 비용 발생) | 요청당 요금 + 컴퓨팅 시간당 요금 (유휴 비용 없음) |
## 예시
### HPC 워크로드 설계
1. 유체 역학 시뮬레이션과 같은 HPC 워크로드를 실행해야 하며, 노드 간 낮은 네트워크 지연 시간이 필수적이다.
2. EC2 C6gn(컴퓨팅 최적화) 인스턴스 유형을 선택하고, Cluster Placement Group에 배포한다.
3. EFA(Elastic Fabric Adapter)를 활성화하여 노드 간 통신 지연 시간을 최소화하고, 병렬 처리 성능을 극대화한다.
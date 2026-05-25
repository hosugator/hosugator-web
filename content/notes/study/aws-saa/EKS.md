---
created: 2025-11-17
tags: [aws_saa, aws, eks, kubernetes, containers, orchestration, serverless]
reference:
---
# AWS EKS (Elastic Kubernetes Service)
## 정의
클라우드에서 쿠버네티스([[Kubernetes]])를 쉽게 배포·관리·확장하는 완전 관리형 컨테이너 오케스트레이션 서비스

## 원리
### 관리형 컨트롤 플레인
- EKS는 쿠버네티스 클러스터의 핵심인 컨트롤 플레인 (API 서버, etcd, 스케줄러 등)을 AWS가 여러 가용 영역(AZ)에 걸쳐 자동으로 프로비저닝하고 운영하여 고가용성 및 운영 복잡성 최소화를 보장한다.
- 사용자는 컨트롤 플레인의 기본 인프라 관리에 대해 신경 쓸 필요가 없다.

### 표준 쿠버네티스 호환성
- EKS는 업스트림(Upstream) 쿠버네티스를 실행하므로, 개발자는 `kubectl`, Helm 등 기존 쿠버네티스 생태계의 모든 도구와 API를 그대로 사용하여 클러스터에 배포할 수 있다.

## 요소
- 컨트롤 플레인 (Control Plane): AWS가 관리하며, 쿠버네티스 API 서버가 외부에 노출되어 사용자가 클러스터와 상호작용하는 엔드포인트 역할을 한다.
- 워커 노드 (Worker Node) / 데이터 플레인 (Data Plane): 컨테이너(Pod)가 실제로 실행되는 컴퓨팅 리소스이다. 세 가지 방식으로 구성 가능하다.
    1. 관리형 노드 그룹 (Managed Node Groups): AWS가 EC2 인스턴스의 프로비저닝 및 라이프사이클을 관리.
    2. 자체 관리형 노드 (Self-managed Nodes): 사용자가 EC2 인스턴스를 직접 구성 및 관리.
    3. [[Fargate]] 런치 타입: 서버리스 옵션으로, 워커 노드 관리 없이 컨테이너 실행에 필요한 리소스만 정의하여 사용.
- CNI 플러그인 (VPC CNI): EKS의 Pod는 AWS VPC의 실제 IP 주소를 할당받아, VPC 내 다른 AWS 리소스처럼 직접 통신할 수 있다.

## 특징 및 통합
- 보안 (IAM 통합): [[IAM]]을 통해 쿠버네티스 리소스에 대한 접근 권한을 관리하며, 강력한 인증 및 인가를 제공한다.
- 확장성 (Auto Scaling): 클러스터 오토 스케일러(Cluster Autoscaler)와 Karpenter를 사용하여 트래픽 변화에 따라 워커 노드를 자동으로 확장 및 축소한다.
- 네트워킹 (Load Balancer): 쿠버네티스 Service 오브젝트를 통해 [[ELB]] (ALB/NLB)를 자동으로 프로비저닝하여 외부 트래픽을 처리한다.
- 비용 모델: AWS는 관리형 컨트롤 플레인에 대해 시간당 요금을 청구하며, 워커 노드(EC2 또는 Fargate) 리소스에 대한 비용은 별도로 발생한다.
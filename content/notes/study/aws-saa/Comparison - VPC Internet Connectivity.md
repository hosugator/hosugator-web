---
created: 2025-11-25
tags: [comparison, vpc, internet_access, security, cost, nat_gateway, internet_gateway, vpc_endpoint]
reference:
  - "[[NAT Gateway]]"
  - "[[VPC Architecture for Performance and Security]]"
---
# Comparison - VPC Internet Connectivity (VPC 인터넷 연결 방식 비교)

## 비교 목적 (Objective)
 Context: VPC 내의 인스턴스가 외부 인터넷 또는 AWS 서비스에 연결할 때, 보안성, 통제권, 비용 효율성을 극대화하는 최적의 아키텍처를 결정하는 설계 원리.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | Public Subnet (직접 연결) | NAT Gateway (간접 연결) | VPC Endpoint (내부 연결) |
| :--- | :--- | :--- | :--- |
| 적용 대상 | Public Subnet의 인스턴스 (Web Server, [[ELB]] 등) | Private Subnet의 인스턴스 | Private Subnet의 인스턴스 (AWS 서비스에만 해당) |
| 주요 목적 | 인/아웃바운드 모두 허용 (전면 노출) | 아웃바운드만 허용 (보안성 확보) | AWS 내부 망을 통한 접근 (보안/비용 최적화) |
| 필수 구성 | Internet Gateway (IGW) 연결 및 EIP 할당 | Public Subnet에 배포, EIP 연결, Private Route Table 수정 | Gateway 또는 Interface Endpoint 생성 |
| 운영 관리 | 사용자가 관리 (OS 보안, 방화벽 등) | 완전 관리형 (고가용성 및 확장성 보장) | AWS가 완전 관리 (설정만 필요) |

## 선택 기준 및 로직 (Selection Criteria)

### 🥇 Public Subnet (IGW 직접 연결)을 선택해야 하는 경우
 조건: 외부 인터넷으로부터 인바운드 연결(접속)을 받아야 하는 서비스(웹 서버, 로드 밸런서)이거나, 보안보다 접근성이 중요한 경우.
     Ex: 공용 웹사이트의 [[EC2]] 인스턴스, [[ELB]]와 같은 네트워크 경계 서비스.

### 🥈 NAT Gateway를 선택해야 하는 경우
 조건: 프라이빗 서브넷의 인스턴스가 외부 인터넷으로 업데이트 다운로드 등 아웃바운드 연결이 필요하지만, 외부에서 직접 접속되는 것을 완벽하게 차단해야 할 경우.
     Ex: 백엔드 애플리케이션 서버, 데이터베이스 서버의 OS 패치 다운로드.
     주의: NAT Gateway는 AZ별로 배포해야 HA가 보장되며, 데이터 처리 비용이 부과되므로 비용 고려가 필요하다.

### 🥉 VPC Endpoint를 선택해야 하는 경우
 조건: 프라이빗 서브넷의 인스턴스가 Amazon S3, DynamoDB, SQS 등 AWS 내부 서비스에 접속해야 할 경우.
     Ex: S3에 로그를 기록하거나 DynamoDB에 데이터를 쓰는 애플리케이션 서버.
     주요 이점: 트래픽이 AWS 네트워크 내부에 머물러 보안이 강화되며, NAT Gateway를 통과할 때 발생하는 데이터 처리 요금을 절감할 수 있어 비용 효율적이다.

---
Conclusion:
보안과 비용을 최적화하려면, 외부 인터넷 접속은 NAT Gateway를, AWS 서비스 접속은 VPC Endpoint를 사용하는 것이 AWS의 모범 사례이다.
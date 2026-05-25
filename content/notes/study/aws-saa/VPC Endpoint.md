---
created: 2025-11-14
tags: [aws_saa, aws, vpc_endpoint, security, networking, private_link]
reference:
---
# Amazon VPC Endpoint
## 정의
AWS 네트워크 내에서 [[VPC]]와 AWS 서비스 또는 VPC Endpoint 서비스 간에 프라이빗 연결을 생성하여 공용 인터넷 게이트웨이, NAT 디바이스, VPN 연결 없이 통신할 수 있도록 하는 기능
## 원리
### 프라이빗 연결
- 기본적으로 AWS 서비스는 공용 IP 주소를 통해 인터넷에서 접근된다. VPC Endpoint는 이 접근을 VPC 내부의 프라이빗 네트워크 경로로 전환한다.
- 이 경로를 사용하면 [[VPC]]의 인스턴스가 AWS 서비스와 통신할 때 인터넷 게이트웨이(IGW)를 통과할 필요가 없어 보안과 네트워크 성능이 향상된다.
### 엔드포인트 정책
- 엔드포인트 정책(Endpoint Policy)을 사용하여 지정된 엔드포인트(예: 특정 S3 버킷)를 통해 액세스할 수 있는 [[IAM]] 사용자 및 리소스를 제어할 수 있다.
## 요소
- 게이트웨이 엔드포인트 (Gateway Endpoint):
    - [[S3]]와 [[Amazon DynamoDB]]에 대한 액세스를 [[VPC]] 라우팅 테이블을 통해 라우팅하는 방식이다.
    - 프라이빗 IP 주소가 아닌, 라우팅 테이블 항목으로 작동한다.
    - 비용이 부과되지 않는다.
- 인터페이스 엔드포인트 (Interface Endpoint):
    - Elastic Network Interface (ENI)를 사용하여 서비스에 대한 액세스를 제공한다.
    - 대부분의 AWS 서비스 (예: [[SNS]], [[AWS Systems Manager]], API Gateway) 및 AWS Marketplace의 PrivateLink 파트너 서비스에 사용된다.
    - 프라이빗 IP 주소를 가지며, 시간 및 데이터 처리량에 따라 비용이 부과된다.
- PrivateLink: AWS가 인터페이스 엔드포인트를 기반으로 제공하는 기술로, 서비스 제공자가 소비자에게 자신의 서비스를 프라이빗하게 노출할 수 있도록 한다.
## 특징
- 보안 강화: [[VPC]] 내의 인스턴스가 인터넷을 통하지 않고 AWS 서비스에 접근하므로 데이터 유출 위험을 줄인다.
- 네트워크 단순화: NAT Gateway나 Public IP 없이 Private Subnet에서 AWS 서비스에 접근할 수 있다.
- 서비스 제어: VPC Endpoint 정책을 사용하여 [[IAM]] 정책 외에 추가적인 네트워크 기반 액세스 제어 계층을 추가한다.
## 비교
| 구분 | 게이트웨이 엔드포인트 (GWL) | 인터페이스 엔드포인트 (ENI/PrivateLink) |
| :--- | :--- | :--- |
| 지원 서비스 | [[S3]], [[Amazon DynamoDB]]만 지원 | 대부분의 AWS 서비스 및 PrivateLink 파트너 |
| 접근 방식 | [[VPC]] 라우팅 테이블 항목을 통한 라우팅 | [[VPC]] 서브넷의 ENI (프라이빗 IP 주소)를 통해 접근 |
| 비용 | 없음 (Free) | 시간당 및 데이터 처리량 기반 요금 부과 |
## 예시
- 프라이빗 S3 액세스:
    1. Private Subnet에 있는 [[EC2]] 인스턴스가 인터넷 연결 없이 [[S3]]에 백업 파일을 저장해야 한다.
    2. 게이트웨이 VPC Endpoint를 생성하고, 해당 Private Subnet의 라우팅 테이블에 Endpoint 경로를 추가한다.
    3. 이제 [[EC2]] 인스턴스는 인터넷 게이트웨이 없이 프라이빗 AWS 네트워크를 통해서만 [[S3]]에 접근할 수 있어 보안이 강화된다.
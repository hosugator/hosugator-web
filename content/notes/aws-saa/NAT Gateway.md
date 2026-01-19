---
created: 2025-11-25
tags: [aws_saa, vpc, nat_gateway, internet_access, private_subnet, high_availability, cost]
reference:
  - "[[High-Performing and Scalable Network Solutions]]"
  - "[[VPC Architecture for Performance and Security]]"
---
# NAT Gateway (네트워크 주소 변환 게이트웨이)

## 정의 (Definition)
프라이빗 서브넷에 위치한 [[EC2]] 인스턴스가 외부 인터넷으로 아웃바운드 연결(Outbound Connection)을 설정할 수 있도록 허용하는 완전 관리형(Managed), 고가용성 네트워크 주소 변환(NAT) 서비스

## 핵심 맥락 (Context & Why)
 Problem: 프라이빗 서브넷의 서버(DB, 애플리케이션 등)는 외부에서 직접 접근할 수 없도록 격리되어야 하지만, OS 업데이트 다운로드나 외부 서비스와의 통신을 위해 인터넷 아웃바운드 연결이 필요하다.
 Solution: [[NAT Gateway]]는 프라이빗 인스턴스를 외부에 노출하지 않으면서 인터넷 접속을 허용하고, [[NAT Instance]]에 비해 훨씬 높은 성능과 확장성을 제공하여 관리 부담을 제거한다.

## 작동 원리 (Mechanism)
 아웃바운드 전용 (Outbound Only): 프라이빗 인스턴스에서 시작된 트래픽에 대한 응답 트래픽만 허용하고, 외부에서 시작된 인바운드 연결은 허용하지 않아 보안을 강화한다.
 배포 및 라우팅: [[NAT Gateway]]는 Public Subnet에 배포되어야 하며, 반드시 하나의 EIP (Elastic IP)가 연결된다. 프라이빗 서브넷의 [[Route Table]]에서 인터넷 대상(`0.0.0.0/0`) 트래픽을 [[NAT Gateway]]로 라우팅해야 작동한다.
 고가용성: AWS가 완전 관리하며, AZ(가용 영역) 내에서 고가용성을 보장한다. 단, AZ 장애 대비를 위해서는 각 AZ마다 별도의 [[NAT Gateway]]를 배포해야 한다.

## 유비 및 비교 (Analogy & Comparison)
 It's like: 외부와 격리된 은행의 금고실(프라이빗 서브넷)에서, 인가된 직원(프라이빗 인스턴스)이 외부 공급업체에 물품 주문서(아웃바운드 트래픽)를 안전하게 내보낼 수 있는 '보안 검증된 우편 창구' 역할을 한다.
 vs [VPC Endpoint] (비용 및 보안 측면):

| 비교 기준 | NAT Gateway | VPC Endpoint |
| :--- | :--- | :--- |
| 목적 | 외부 인터넷으로의 아웃바운드 연결 | AWS 서비스([[S3]], [[DynamoDB]] 등)로의 프라이빗 연결 |
| 트래픽 경로 | 인터넷 게이트웨이를 거쳐 공용 인터넷을 통과 | AWS 네트워크 내부를 통해 연결 (보안 강화) |
| 비용 최적화 | 시간당 프로비저닝 요금 + 데이터 처리 요금 부과 | Endpoint 요금만 부과. NAT Gateway를 우회하여 데이터 처리 요금 절감 |
| 결론 | 외부 인터넷 접속이 필수일 때 사용. | S3나 DynamoDB와 같은 AWS 서비스로의 트래픽은 VPC Endpoint를 사용하여 비용을 절감해야 한다.

## 예시 및 구조 (Example/Structure)
### 프라이빗 서버의 소프트웨어 업데이트 및 비용 최적화
1. 필요성: 프라이빗 서브넷의 서버가 외부 리포지토리에서 OS 업데이트를 다운로드하고, 동시에 [[S3]]에 로그를 업로드해야 한다.
2. 솔루션:
     외부 업데이트: 서버의 [[Route Table]]에서 외부 인터넷(`0.0.0.0/0`) 트래픽은 [[NAT Gateway]]로 라우팅한다.
     S3 액세스: [[S3]]로 가는 트래픽은 Gateway VPC Endpoint를 사용하여 [[NAT Gateway]]를 우회하도록 설정한다.
3. 결과: OS 업데이트는 NAT Gateway를 통해 안전하게 수행되며, S3 로그 업로드 트래픽은 NAT Gateway의 데이터 처리 요금을 발생시키지 않아 비용이 절감된다.
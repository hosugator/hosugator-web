---
created: 2026-01-28
tags:
  - aws
  - taxonomy
  - cloud
---
# AWS Cloud Service Taxonomy

## 본질 (Essence)
클라우드 생태계를 구성하는 7가지 핵심 기능적 분류. 인프라(뼈대), 보안(방패), 운영(신경계), 연결(관절)의 조화.

## 구조 (Mechanism)
### 1. 컴퓨팅 (Compute: 연산 엔진)
- **EC2**: 가상 서버 (가장 높은 제어권)
- **Lambda**: 서버리스 함수 (이벤트 기반 실행)
- **ECS / EKS**: 컨테이너 오케스트레이션 (Docker/K8s)
- **Fargate**: 서버리스 컨테이너 실행 환경

### 2. 네트워킹 및 콘텐츠 전송 (Networking & Content Delivery: 길)
- **VPC**: 격리된 프라이빗 네트워크 환경
- **Route 53**: 지능형 DNS 라우팅
- **CloudFront**: CDN, 글로벌 엣지 캐싱
- **Global Accelerator**: 전용망 기반 트래픽 가속 및 고정 IP

### 3. 스토리지 (Storage: 보관함)
- **S3**: 객체 스토리지 (무제한 확장, 정적 웹 호스팅)
- **EBS**: 블록 스토리지 (EC2 전용 디스크)
- **EFS**: 파일 스토리지 (여러 EC2가 공유하는 NFS)
- **Storage Gateway**: 온프레미스와 클라우드 연결

### 4. 데이터베이스 (Database: 구조화 데이터)
- **RDS**: 관계형 DB (MySQL, PostgreSQL, SQL Server 등)
- **Aurora**: AWS 최적화 고성능 관계형 DB
- **DynamoDB**: NoSQL (밀리초 응답, 무한 확장)
- **ElastiCache**: 인-메모리 캐싱 (Redis/Memcached)

### 5. 보안, 자격 증명 및 규정 준수 (Security & Identity: 방패)
- **IAM**: 권한 및 계정 관리의 근간
- **WAF**: L7 웹 방화벽 (악성 요청 및 과다 요청 차단)
- **Shield**: L3/L4 DDoS 방어
- **KMS / Secrets Manager**: 암호화 키 및 비밀값 관리

### 6. 관리 및 거버넌스 (Management & Governance: 신경계)
- **CloudWatch**: 리소스 모니터링 및 실시간 로그
- **CloudTrail**: API 호출 기록 및 감사(Audit)
- **AWS Config**: 리소스 설정 변경 이력 및 준수 확인
- **Organizations**: 다중 계정 중앙 집중 관리

### 7. 애플리케이션 통합 (Application Integration: 연결 고리)
- **SQS**: 메시지 큐 (서비스 간 비동기 결합 분리)
- **SNS**: 알림 및 메시지 게시/구독
- **Step Functions**: 워크플로우 오케스트레이션

## 확장 (Connection)
- **연결**: 컴퓨팅/스토리지/DB/네트워크가 '인프라'를 형성하고, 그 위를 보안과 운영 계층이 감싸며, 통합 계층이 각 서비스를 유기적으로 엮음.
- **응용**: 특정 문제 상황에서 "어느 계층의 솔루션이 필요한가?"를 먼저 판단하면 오답 후보를 빠르게 소거할 수 있음.

---
See Also: 
- [[AWS Security Strategy]]
- [[Caching Strategy]]
- [[AWS Resiliency Strategy]]
- [[AWS Data Bridge Strategy]]
- [[AWS Data Retention Strategy]]
- [[Multi-Region Routing Strategy]]
- [[AWS Data Multi-Region Strategy]]
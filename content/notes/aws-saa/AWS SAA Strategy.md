---
created: 2025-12-16
tags: [aws_saa, saa-c03, exam_prep, core_services, high_weightage]
reference:
  - "[[AWS Certified Solutions Architect – Associate (SAA-C03)]]"
---
# SAA-C03 합격 핵심 요약 (레딧 후기 기반)

## 정의 (Definition)
AWS Solutions Architect Associate (SAA-C03) 시험 통과를 위해 가장 중요하게 다루어야 할 고가중치(High Weightage) 서비스와 설계 개념을 정리한 핵심 학습 가이드

## 핵심 맥락 (Context & Why)
 Problem: SAA-C03 시험 범위가 방대하여, 학습 방향을 설정하고 핵심 출제 영역에 집중하는 데 어려움이 있다.
 Solution: 실제 시험 합격자가 제시한 필수(MUST) 학습 주제를 중심으로 학습 로드맵을 단순화하고, 시나리오 기반 아키텍처 논리 이해에 초점을 맞춘다.

## 핵심 출제 영역 및 주제 (Core Topics)

### 1. 🥇 EC2 & 컴퓨팅 (매우 중요)
 - [[EC2]]: [[EC2 Instance Types and Performance]], [[EC2 Purchasing Options Comparison]]
 스케일링: Auto Scaling 그룹의 기본 동작 방식 및 구성 [[Scaling Comparison]], [[Auto Scaling and Monitoring]]
 로드 밸런싱: ALB (애플리케이션 계층)와 NLB (성능, 고정 IP)의 명확한 차이점, [[ELB]], [[Load Balancers (ALB, NLB, CLB)]]

### 2. 🥈 S3 (높은 가중치)
 스토리지 클래스: 모든 클래스(Standard, IA, Glacier, One Zone-IA)의 접근 시간, 비용, 가용성/내구성 비교
 데이터 관리: Lifecycle rules (비용 최적화), Versioning (실수 방지)
 보안: Encryption (SSE-S3, SSE-KMS), Bucket Policies, S3 Access Points의 사용 목적

### 3. 🛡️ IAM & 보안 (필수)
 IAM: IAM Roles (서비스 간 권한 위임) 및 Policies (JSON 구조 이해)
 키 관리: KMS 기본 작동 원리
 조직 거버넌스: MFA, Organizations SCP (서비스 제어 정책)

### 4. 🌐 VPC & 네트워킹 (필수 지식)
 기본 요소: Subnets (Public/Private), Route Tables, Security Groups vs NACLs (Stateful vs Stateless) 차이
 게이트웨이: NAT Gateway (Private Subnet의 아웃바운드 인터넷) vs Internet Gateway (Public Subnet의 인바운드/아웃바운드 인터넷)
 연결: VPC Peering (1:1 연결)과 Transit Gateway (다수 VPC 연결) 비교

### 5. 🗄️ RDS & 데이터베이스
 RDS 고가용성: Multi-AZ (HA) vs Read Replicas (성능 확장)
 NoSQL: DynamoDB 기본 개념 및 특징
 Aurora: Aurora의 핵심 기능 및 성능 이점

### 6. 📈 고가용성 및 아키텍처
 재해 복구: Multi-AZ (고가용성)와 Multi-Region (DR) 설계 패턴
 메시징: SQS (메시지 큐)와 SNS (푸시 알림/구독)를 사용한 Event-driven designs
 CDN: CloudFront (Global Caching)와 Global Accelerator (Global Performance & Non-HTTP)

### 7. 💰 모니터링 및 비용 최적화
 모니터링: CloudWatch metrics (성능 데이터), CloudTrail basics (API 활동 로깅)
 최적화: Trusted Advisor (모범 사례 권장), Cost Explorer (비용 분석)

## 학습 전략 (Study Tip)
 시나리오 기반 학습: 단순히 서비스의 기능을 암기하는 것보다, '왜(Why)' 특정 서비스(예: SQS 또는 Lambda)가 특정 시나리오에 사용되어야 하는지 아키텍처 논리를 이해하는 것이 시험 통과에 결정적이다.
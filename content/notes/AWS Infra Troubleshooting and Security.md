---
created: 2026-02-10
updated: 2026-02-10
type: insight
status: 1-draft
subject: "[[Infra]]"
project: "[[MOC - SAA Study]]"
tags:
  - aws
  - infra
  - security
  - oidc
  - troubleshooting
publish: true
---
# AWS Infra Troubleshooting and Security

## 본질 (Essence)
- "금고 열쇠를 직접 들고 다니는 위험 대신, 단 하나의 신분증(IAM Role)으로 상황에 맞는 임시 통행증(STS)을 발급받아 보안 구역을 통과하는 시스템"

## 내용 (Content)
### 1. Security: IAM Role & STS Mechanism
- Core Principle: 요청자가 여러 개의 신분증을 만들 필요 없이, 단일 IAM Role에 여러 `sts:AssumeRole` 권한을 부여하여 다양한 타겟 역할을 수행함.
- Protocol: 요청자(신분증) -> STS(중개인) -> 제공자(Trust Policy 확인) -> 임시 통행증(Access/Secret Key, Session Token) 발급.
- Advantage: 하드코딩된 자격 증명을 제거하여 OIDC 기반의 'IAM 보안의 정석'을 실현함.

### 2. Network: Route 53 & CloudFront Integration
- Issue: Root domain과 www subdomain 간의 업데이트 비동기화 및 접속 에러.
- Solution: CloudFront Function을 Edge단에 배치하여 모든 www 트래픽을 루트 도메인으로 강제 Redirection함.

### 3. Troubleshooting: ALB-ECS 502 Bad Gateway
- Problem: 대상 그룹(Target Group)과 ECS 서비스 간의 포트 불일치로 인한 헬스 체크 실패.
- Solution: 잘못된 설정의 Target Group을 폐기 후 재생성하고, 가용 영역(AZ)에 따른 Subnet 라우팅을 재정렬하여 트래픽 경로를 정상화함.

## 연결 (Connection)
- Relevance: [[MOC - SAA Study]]의 자격 증명 관리와 부하 분산 이론을 [[Go2fit]] 인프라 최적화에 적용.
- Comparison: 고정 키 방식인 [[IAM User Access Key]] 대비 보안성 및 운영 효율성이 현격히 높음.

---
See Also: 
- [[IAM Role vs User]]
- [[AWS STS Deep Dive]]
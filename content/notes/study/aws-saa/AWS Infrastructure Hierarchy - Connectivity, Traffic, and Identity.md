---
created: 2025-12-24 Wed
tags: [architecture, networking, security, hierarchy]
reference:
  - "[[AWS Networking Fundamentals]]"
  - "[[AWS IAM & Resource Policy]]"
---
# AWS Infrastructure Hierarchy: Connectivity, Traffic, and Identity

## 1단계: 통로 (Connectivity) - "길이 뚫려 있는가?"
데이터가 이동할 수 있는 물리적/논리적 경로 자체를 의미합니다.

| 분류 | 주요 도구 (Components) | 용도 및 특징 |
| :--- | :--- | :--- |
| **외부 연결** | **Internet Gateway (IGW)** | VPC를 퍼블릭 인터넷과 연결하는 유일한 관문 |
| **내부 연결** | **VPC Peering** | 서로 다른 두 VPC를 프라이빗하게 연결 (1:1) |
| **전용 통로** | **VPC Endpoint (PrivateLink)** | 인터넷 없이 S3, DynamoDB 등 AWS 서비스에 직접 접속 |
| **하이브리드** | **Site-to-Site VPN / Direct Connect** | 온프레미스(사무실)와 AWS VPC를 연결 |

## 2단계: 검문 (Traffic Control) - "지나갈 수 있는 패킷인가?"
뚫려 있는 길목에서 IP와 포트 번호를 기준으로 패킷을 필터링합니다.

| 분류 | 주요 도구 (Components) | 용도 및 특징 |
| :--- | :--- | :--- |
| **서브넷 검문** | **Network ACL (NACL)** | 서브넷 경계에서 In/Out 트래픽 차단 (Stateless, Deny 가능) |
| **인스턴스 검문** | **Security Group (SG)** | 리소스 레벨에서 허용된 트래픽만 수신 (Stateful, Allow 위주) |
| **상태 검사** | **AWS WAF** | L7 계층에서 SQL 인젝션, 대량 요청 등 악성 페이로드 검사 |

## 3단계: 자격 (Identity & Auth) - "누구이며, 무엇을 할 수 있는가?"
검문을 통과한 요청이 실제로 작업을 수행할 수 있는 신분과 권한이 있는지 확인합니다.

| 분류 | 주요 도구 (Components) | 용도 및 특징 |
| :--- | :--- | :--- |
| **사용자 자격** | **IAM User / Group / Role** | "누가(Who)"에 해당. 서비스 호출에 필요한 권한 부여 |
| **리소스 정책** | **S3 Bucket / API GW Resource Policy** | "어디로(Where)"에 해당. 특정 IP/VPC만 접근하도록 문 입구에 비치한 명단 |
| **임시 권한** | **STS (AssumeRole)** | 외부 유저나 서비스에 일시적인 권한 티켓을 발행 |

---
**Conclusion:**
1. 통로가 없으면 연결조차 안 됨 (Timeout)
2. 검문에서 막히면 패킷이 드랍됨 (Connection Refused)
3. 자격이 없으면 인증 오류가 발생함 (403 Forbidden / Access Denied)
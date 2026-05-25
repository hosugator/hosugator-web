---
created: 2026-01-28
tags:
  - aws
  - security
  - strategy
  - shield
  - waf
  - sg
  - nacl
  - iam
  - kms
  - ssm
  - macie
---
# AWS Security Strategy

## 본질 (Essence)
성문 밖의 거대 군대를 막는 것(Shield)부터, 성문에 들어오는 개개인의 소지품 검사(WAF), 그리고 성 안의 열쇠 관리(KMS/IAM)까지 단계별로 차단하는 다중 방어 전략

## 구조 (Mechanism)
### 1. 외곽 방어선 (Edge Protection: 계층별 차단)
- **AWS Shield (L3/L4 차단)**: 
    - **기준**: IP/Port/Protocol 및 패킷의 물리적 폭주
    - **특징**: 도로를 통째로 막아 인프라 마비를 방어(DDoS). 개별 요청의 '의도'는 읽지 않음
    - **유형**: Standard(기본 무료), Advanced(유료/DDoS 전담팀 지원/보험)
- **AWS WAF (L7 차단)**: 
    - **기준**: HTTP Header/Body, URI, Query String, Rate-based(IP+알파)
    - **특징**: 편지 봉투를 열어 '내용물'과 '의도'를 분석. 정상적인 증가는 통과시키고, 비정상 패턴만 골라내는 정교한 차단 가능
    - **응용**: SQL 인젝션, XSS, 특정 IP의 주가 조회 과다 요청(Rate-based) 방어

### 2. 네트워크 방어선 (Network Security: 통로 차단)
- **Security Group (SG)**: 인스턴스 단위의 '상태 저장(Stateful)' 방화벽. 허용 규칙 위주.
- **Network ACL (NACL)**: 서브넷 단위의 '상태 비저장(Stateless)' 방화벽. 명시적 거부(Deny) 가능.

### 3. 내부 자원 및 데이터 방어선 (Data & Access: 미시적 통제)
- **IAM**: 서비스 접근 권한(Identity) 통제의 근간.
- **AWS KMS**: 데이터 암호화 키 관리 및 복호화 통제.
- **AWS Secrets Manager**: DB 비밀번호 등 동적 비밀값 저장 및 자동 교체.
- **Amazon Macie**: S3 내 민감 정보(개인정보 등) 탐지 및 보호.

## 확장 (Connection)
- **연결**: 아파트 단지 입구 차단기(Shield) → 현관 보안 요원의 소지품 검사(WAF) → 방문객 명단 확인(IAM) → 집안 금고(KMS) 순의 방어 체계.
- **응용**: "IP는 같으나 정상 유저와 공격자를 구분해야 한다"면 L7 계층의 WAF 설정을 최우선으로 검토.

---
See Also: 
- [[AWS Network Connectivity Strategy]]
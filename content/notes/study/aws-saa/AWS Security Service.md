---
created: 2026-01-23
tags:
  - aws
  - security
  - compliance
  - infrastructure
---
# AWS Security Service

## 본질 (Essence)
클라우드 인프라, 데이터, 애플리케이션을 외부 위협으로부터 보호하고 가시성을 확보하기 위한 다층 보안 체계.

## 구조 (Mechanism)
- **AWS Shield**: DDoS 방어 서비스.
  - **Standard**: 모든 고객 기본 제공(L3/L4 보호).
  - **Advanced**: 대규모 공격 방어, 전문가(DRT) 지원, 비용 보호.
- **AWS WAF**: 애플리케이션 방화벽. SQL 인젝션, XSS 등 L7 공격 차단 및 IP 기반 접근 제어.
- **AWS GuardDuty**: 지능형 위협 탐지. 머신러닝을 통해 VPC 로그, DNS 로그 등을 분석하여 악의적 활동 감시.
- **AWS Inspector**: EC2, 컨테이너, 람다의 소프트웨어 취약점 및 네트워크 노출 자동 보안 평가.
- **AWS KMS (Key Management Service)**: 데이터 암호화에 사용되는 암호화 키를 생성하고 관리.
- **AWS Secrets Manager**: API 키, DB 비밀번호 등 민감한 정보를 안전하게 저장하고 자동 교체(Rotation).

## 확장 (Connection)
- **연결**: WAF(입구 검문) -> Shield(외부 공격 방어) -> GuardDuty(내부 거동 감시) -> KMS(데이터 금고)로 이어지는 심층 방어(Defense in Depth) 전략.
- **응용**: "대규모 DDoS 방어"는 Shield Advanced, "DB 비밀번호 관리"는 Secrets Manager, "취약점 스캔"은 Inspector를 매칭.

---
See Also: 
- [[Shield]]
- [[WAF]]
- [[GuardDuty]]
- [[Inspector]]
- [[KMS]]
- [[Secrets Manager]]
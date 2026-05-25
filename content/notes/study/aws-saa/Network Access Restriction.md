---
created: 2026-01-23
tags:
  - aws
  - networking
  - security
  - strategy
---
# Network Access Restriction

## 본질 (Essence)
보안 강화 및 비용 절감을 위해 사용자 위치(Geo)나 특정 요청 조건에 따라 최전방(Edge)에서부터 트래픽을 선별적으로 차단하는 전략

## 구조 (Mechanism)
- **CloudFront Geo Restriction (최우선)**: 전 세계 엣지 로케이션에서 국가별 접속을 차단. 오리진(ALB, EC2) 부하와 네트워크 비용을 최소화하는 가장 효율적인 지점.
- **AWS WAF (정밀 제어)**: L7 계층에서 패킷 본문을 검사. 특정 국가 차단뿐만 아니라 SQL 인젝션, XSS 등 복잡한 공격 패턴을 탐지하여 CloudFront나 ALB에 부착.
- **Route 53 Geolocation (경로 제어)**: DNS 수준에서 특정 국가 유저를 특정 엔드포인트로 안내하거나 응답하지 않음. 단, IP 직접 접속은 막을 수 없음.
- **Security Group / NACL (하위 계층)**: L4 수준에서 IP/Port 기반 차단. 국가 정보 등 컨텍스트 기반 차단은 불가능.

## 확장 (Connection)
- **연결**: "더 앞단에서 막을수록 유리하다"는 원칙에 따라 CloudFront(최전방) -> WAF -> ALB -> Security Group 순으로 방어선 구축.
- **응용**: 글로벌 서비스에서 라이선스 문제로 특정 국가 접속을 막아야 한다면 CloudFront 수준에서 지리적 제한을 설정하는 것이 가장 경제적이고 확실한 방법임.

---
See Also: 
- [[AWS Security Service]]
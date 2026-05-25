---
created: 2026-01-20
tags:
  - Identity
  - federation
  - on-premise
  - cloud
  - idp
  - sp
  - trust
  - relationship
  - ad
---
# Identity Federation (자격 증명 연합)

## 본질 (Essence)
서로 다른 시스템이 신뢰 협정을 맺어, 한 곳의 인증 정보를 다른 곳에서도 그대로 사용하는 '통합 신원 관리'

## 구조 (Mechanism)
- **Identity Provider (IdP)**: 신원을 보증하는 주체(예: 온프레미스 AD). 사용자 인증의 수행 주체
- **Service Provider (SP)**: 리소스를 제공하는 주체(예: AWS). IdP의 인증 결과(SAML 토큰 등)를 믿고 권한을 부여
- **Trust Relationship**: 두 시스템 간의 '신뢰 조약'. 이를 통해 사용자는 추가 로그인 없이(SSO) 계정 경계를 넘나듦

## 확장 (Connection)
- **연결**: 국가 간 '여권(IdP 발행)'을 통해 '입국 비자(SP 권한)'를 면제받거나 간소화하는 외교적 연합(Federation)과 유사
- **응용**: 퇴사자 발생 시 AD에서만 계정을 삭제하면 연동된 모든 클라우드(AWS, Azure 등)의 접근권이 즉시 차단되어 보안 거버넌스가 강화

---
See Also: 
- [[Centralized IAM Architecture (Hub-and-Spoke)]]
- [[AWS STS]]
- [[AD]]
- [[AWS Client VPN]]
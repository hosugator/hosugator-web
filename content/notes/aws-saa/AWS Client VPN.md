---
created: 2026-01-20
tags:
  - aws
  - vpn
  - client
  - wifi
  - vpc
  - auth
---
# AWS Client VPN

## 본질 (Essence)
어디서나 인터넷을 통해 AWS 리소스 또는 온프레미스 네트워크에 안전하게 접근할 수 있도록 해주는 클라이언트 기반의 관리형 VPN 서비스

## 구조 (Mechanism)
- **TLS 터널링**: OpenVPN 프로토콜을 사용하여 사용자의 기기와 AWS VPC 사이에 암호화된 통로를 생성함.
- **인증 및 인가**: Active Directory, SAML 연동(IdP), 또는 인증서 기반 인증을 통해 사용자를 식별하고, 네트워크 수준의 접근 제어(Authorization)를 수행함.
- **엔드포인트**: 사용자는 클라이언트 소프트웨어를 통해 특정 VPN 엔드포인트에 접속하며, 이는 멀티 AZ 설정을 통해 높은 가용성을 보장함.

## 확장 (Connection)
- **연결**: 카페의 공용 와이파이(위험한 외부 도로)를 이용하면서도, 회사 건물 내부(안전한 VPC)로 바로 연결되는 '장갑차 전용 차로'를 타는 것과 유사함.
- **응용**: 재택근무자가 Private Subnet에 있는 DB에 접근하거나, FSx Windows 파일 서버를 로컬 드라이브처럼 연결하여 사용할 때 핵심 문지기 역할을 함.

---
See Also: 
- [[Identity Federation]]
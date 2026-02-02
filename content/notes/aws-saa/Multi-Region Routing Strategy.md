---
created: 2026-01-22
tags:
  - AWS
  - Architecture
  - Route53
  - CloudFront
---
# 멀티 리전 라우팅 전략 (Route 53 vs CloudFront)

## 본질 (Essence)
길을 물어보는 사람에게 정상적인 입구를 알려주는 안내원(Route 53)과, 입구에 들어온 사람에게 물건을 빨리 전달하는 배달원(CloudFront)의 차이

## 구조 (Mechanism)
- **정의**: 사용자의 요청(Request) 흐름을 제어하는 DNS 레이어와 데이터의 응답(Response) 흐름을 최적화하는 애플리케이션 레이어의 역할 분담
- **핵심**: 
  - **Route 53 (Inbound)**: 사용자에서 서버로 향하는 '방향'을 제어. 헬스 체크를 통해 장애 리전을 원천 차단하는 '능동적 고가용성' 구현.
  - **CloudFront (Outbound)**: 서버에서 사용자로 향하는 '전달'을 가속. 오리진 그룹을 통한 '수동적 재시도'는 가능하나, 전체적인 교통 정리가 주 목적은 아님.

## 확장 (Connection)
- **연결**: 내비게이션(Route 53)이 사고 구간을 피해 길을 안내하면, 택배 차량(CloudFront)이 최적의 터미널을 거쳐 물건을 전달하는 것과 같음.
- **응용**: "High Availability"와 "Health Check"가 동시에 강조되는 멀티 리전 아키텍처 문제에서는 항상 Route 53을 최상위 제어기로 선택함.

---
See Also: 
- [[Route 53]]
- [[CloudFront]]
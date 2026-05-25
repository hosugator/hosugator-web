---
created: 2026-01-23
tags:
  - aws
  - route53
  - routing
  - policy
  - failover
  - multi_value
---
# Route 53 라우팅 정책 (Routing Policy)

## 본질 (Essence)
사용자가 목적지(IP)를 물어볼 때, 비즈니스 목적(가용성, 속도, 비용 등)에 맞춰 가장 적합한 길을 알려주는 '지능형 이정표'

## 구조 (Mechanism)
- **Failover (장애 조치)**: 주(Active)-부(Passive) 구조. 평소엔 1순위로 보내다 장애 시 2순위로 전환. (DR 구축용)
- **Weighted (가중치)**: 정해진 비율(예: 8:2)로 트래픽 분산. (새 버전 테스트/카나리 배포용)
- **Multi-value Answer (다중 값 응답)**: 여러 개의 건강한 IP(최대 8개)를 반환하여 클라이언트가 무작위로 선택하게 함. (기초적인 DNS 부하 분산용)
- **Latency (지연 시간)**: 사용자 위치에서 응답 속도가 가장 빠른 리전의 IP를 반환. (글로벌 사용자 경험 최적화)
- **Geolocation (지리적 위치)**: 사용자의 실제 위치(국가/대륙)에 따라 특정 엔드포인트로 연결. (콘텐츠 현지화/법적 규제 준수)
- **Geoproximity (지리적 근접성)**: 지리적 거리와 사용자 정의 가중치(Bias)를 계산하여 트래픽 영향력을 조절. (리소스 위치 중심의 복잡한 라우팅)
- **IP-based (IP 기반)**: 사용자의 IP 대역(CIDR)에 따라 특정 목적지로 연결. (특정 네트워크 대역 최적화)

## 확장 (Connection)
- **연결**: 입구 안내원이 "VIP는 1번(IP-based), 급한 분은 제일 빠른 길(Latency), 그냥 오신 분은 아무 자리(Multi-value)로 가세요"라고 안내하는 것과 같음.
- **응용**: 'Randomly access' 키워드가 나오면 Multi-value를, 'Active-Passive'나 'DR'이 나오면 Failover를 즉각 떠올려야 함.

---
See Also: 
- [[Route 53]]
---
created: 2025-12-18
tags: [comparison, decision_making]
reference:
  - "[[AWS Global Accelerator]]"
  - "[[Amazon CloudFront]]"
---
# Comparison - Global Network Optimization Services

## 비교 목적 (Objective)
사용자 경험 개선을 위해 전역 네트워크 가속 서비스를 선택할 때, 프로토콜 특성 및 고정 IP 필요 여부에 따른 최적 솔루션 선정.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[AWS Global Accelerator]] | [[Amazon CloudFront]] |
| :--- | :--- | :--- |
| **핵심 철학** | 네트워크 경로 최적화 및 고정 진입점 제공 | 에지 로케이션의 콘텐츠 캐싱을 통한 전송 가속 |
| **주요 프로토콜** | TCP, UDP (게임, IoT 등 광범위 활용) | HTTP, HTTPS (웹 서비스 전용) |
| **진입 방식** | **2개의 고정 Anycast IP 주소 제공** | 가변적인 도메인 네임(CNAME) 기반 접속 |
| **최적화 방식** | AWS 백본망을 통한 레이턴시 감소 | 캐싱을 통한 원본 서버 부하 감소 및 응답 속도 개선 |

## 선택 기준 및 로직 (Selection Criteria)

### [[AWS Global Accelerator]]를 선택해야 하는 경우
* **조건:** UDP 프로토콜을 사용하거나, 화이트리스트 관리를 위해 변하지 않는 고정 IP 주소가 필수적인 경우
    * *Ex:* 실시간 배틀로얄 게임의 위치 동기화 및 전역 매칭 서버 시스템

### [[Amazon CloudFront]]를 선택해야 하는 경우
* **조건:** HTTP 기반의 이미지, 영상, API 응답을 캐싱하여 원본 서버까지의 요청 횟수를 줄여야 하는 경우
    * *Ex:* 전 세계 사용자를 대상으로 하는 고화질 영상 스트리밍 서비스

---
**Conclusion:**
UDP 지원과 고정 IP가 핵심이라면 Global Accelerator, HTTP 콘텐츠 캐싱이 핵심이라면 CloudFront를 선택함.
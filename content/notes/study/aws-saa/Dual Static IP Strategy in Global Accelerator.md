---
created: 2025-12-19
tags:
  - aws
  - global_accelerator
  - networking
  - redundancy
reference:
  - "[[AWS Global Accelerator]]"
  - "[[Comparison - Network Zone vs Availability Zone]]"
---

# Dual Static IP Strategy in Global Accelerator
## 정의 (Definition)
Global Accelerator가 장애 대비 및 높은 신뢰성을 보장하기 위해 사용자에게 서로 다른 네트워크 영역에서 할당하여 제공하는 두 개의 독립적인 Anycast IP 주소 체계
## 핵심 맥락 (Context & Why)
### Problem
단일 IP만 사용할 경우, 해당 IP가 속한 네트워크 경로에 문제가 생기거나 특정 인터넷 서비스 제공업체(ISP)에서 해당 경로로의 접근이 차단되면 사용자는 서비스에 접속할 수 없게 됩니다.
### Solution
서로 다른 네트워크 장비와 경로를 사용하는 두 개의 독립적인 IP를 제공하여, 하나의 경로에 문제가 생기더라도 클라이언트가 자동으로 다른 IP를 통해 접속을 유지할 수 있도록 설계되었습니다.
## 작동 원리 (Mechanism) 
### 독립적 네트워크 할당
두 IP는 서로 다른 네트워크 영역(Network Zone)에서 제공되므로 인프라 수준의 장애가 동시에 발생할 확률을 최소화합니다.
### 클라이언트 측 재시도
대부분의 현대적 클라이언트(브라우저 등)는 첫 번째 IP로 접속이 실패할 경우, 자동으로 리스트에 있는 두 번째 IP로 접속을 시도하여 연결을 복구합니다.
### 상시 활성 상태 (Active-Active)
두 IP는 쓰임새가 다르지 않으며 둘 다 항상 활성화되어 트래픽을 수용할 준비가 되어 있습니다.
## 유비 및 비교 (Analogy & Comparison)
### It's like
비상시에 대비하여 집 현관문에 서로 다른 열쇠 꾸러미를 두 개 만들어 두고, 하나를 잃어버리거나 열쇠 구멍이 고장 나도 다른 하나로 들어갈 수 있게 하는 것과 같습니다.
### vs (유사 개념)
- 단일 IP 구성: 관리 포인트는 적으나 경로 장애 시 대안이 없어 가용성이 낮습니다.
- 듀얼 IP 구성: 클라이언트에게 두 개의 접속 경로를 보장하여 서비스 중단 시간을 최소화합니다.
## 예시 및 구조 (Example/Structure)
사용자가 Global Accelerator 생성 시 할당받는 형태:
1. IP A: 1.2.3.4 (Network Zone 1)
2. IP B: 5.6.7.8 (Network Zone 2)
사용자의 DNS 레코드에는 이 두 IP가 모두 등록되어 상호 보완적으로 작동합니다.
---
See Also:
- [[High Availability Architecture]]
- [[Anycast IP Mechanism]]
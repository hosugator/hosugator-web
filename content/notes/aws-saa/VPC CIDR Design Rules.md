---
created: 2025-12-26
tags:
  - VPC
  - Networking
  - Architecture_Design
reference:
  - "[[Amazon VPC]]"
---
# VPC CIDR 설계 규칙 (VPC CIDR Design Rules)

## 정의 (Definition)
VPC 네트워크의 논리적 범위를 결정하는 IP 주소 대역(CIDR)을 설정할 때 반드시 준수해야 하는 기술적 제약 사항 및 권장 원칙

## 핵심 규칙 (Key Rules)

### 1. 허용되는 블록 크기 (Size Limits)
* **범위**: CIDR 블록 마스크는 **/16(최대)**에서 **/28(최소)** 사이여야 함
* **이유**: /16보다 크면 라우팅 부하가 너무 커지고, /28(IP 16개)보다 작으면 AWS가 예약하는 주소를 제외하고 남는 주소가 거의 없어 네트워크 기능 수행이 어려움

### 2. 피어링 시 중복 금지 (Non-overlapping CIDR)
* **규칙**: 두 VPC를 연결(Peering)하거나 VPN/Direct Connect로 사내망과 연결할 때, 각 네트워크의 CIDR 블록은 **단 1개의 IP도 겹쳐서는 안 됨**
* **결과**: 대역이 겹치면 라우팅 테이블에서 목적지를 구분할 수 없으므로 연결 설정 자체가 거부됨

### 3. 수정 불가 원칙 (Immutability)
* **규칙**: 한 번 생성된 VPC의 주 CIDR 블록은 **변경하거나 삭제할 수 없음**
* **대응**: 크기가 모자랄 경우 보조(Secondary) CIDR 블록을 추가하거나, 아예 새 VPC를 만들어 데이터를 이전해야 함 (초기 설계가 중요한 이유)

### 4. 사설 IP 대역 권장 (RFC 1918)
* **규칙**: 공인 IP와 충돌을 피하기 위해 표준 사설 IP 대역 사용 권장
    * 10.0.0.0/8 (가장 선호됨)
    * 172.16.0.0/12
    * 192.168.0.0/16

## 유비 및 비교 (Analogy & Comparison)
### It's like
VPC CIDR를 정하는 것은 '도시의 우편번호 범위'를 정하는 것과 같음. 옆 도시와 우편번호가 겹치면 편지가 배달되지 않으며(피어링 불가), 한 번 정해진 우편번호 체계는 도시를 허물기 전까지 바꾸기 매우 어려움

## 예시 및 구조 (Example/Structure)
- **잘못된 예**: VPC A(10.0.0.0/16)와 VPC B(10.0.1.0/24) 피어링 -> B가 A의 범위에 포함되므로 중복으로 간주되어 실패
- **올바른 예**: VPC A(10.0.0.0/16)와 VPC B(10.1.0.0/16) 피어링 -> 대역이 완전히 분리되어 성공

---
See Also:
- [[VPC Peering Overview]]
- [[Subnet CIDR Calculation]]
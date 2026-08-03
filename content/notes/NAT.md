---
created: 2025-10-29
updated: 2026-07-22
type: source
status: 2-stable
subject: "[[CS]]"
project: "[[EIP]]"
tags:
  - network
  - nat
  - ip_address
  - address_translation
  - 
publish: true
---
## Header
EIP 학습 중 NAT 개념을 처음 만남.

## Body
### 사설 네트워크 내부의 IP 주소와 인터넷의 공인 IP 주소를 상호 변환하여 네트워크 트래픽을 중개하는 주소 변환 기술이다

- IP 주소 고갈 해결: 부족한 IPv4 공인 주소를 효율적으로 활용하기 위해 다수의 사설 IP를 적은 수의 공인 IP로 변환하여 사용한다.
- 보안 강화: 내부 네트워크의 실제 IP 주소를 외부에 노출하지 않음으로써 외부의 직접적인 공격을 방어하는 계층 역할을 한다.
- 라우터나 방화벽이 패킷 헤더의 출발지/목적지 IP와 포트 정보를 변환하고 이를 변환 테이블(NAT Table)에서 관리한다.

주소 변환 방식: 

- 정적 NAT: 사설 IP와 공인 IP를 1:1로 고정 매핑.
- 동적 NAT: 공인 IP 풀에서 가용한 주소를 동적으로 할당.
- NAPT/PAT: 포트 번호를 활용하여 하나의 공인 IP로 수천 개의 사설 IP 장치를 구분하여 인터넷에 연결한다.


> 제한된 공인 IP 자원 하에서 대규모 네트워크 구축을 가능케 하며, 내부 자산의 은닉화를 통해 엔터프라이즈 네트워크의 보안 수준을 향상시킨다.

## Related
- [[CS]]
- [[Infra]]
- [[NACL]]
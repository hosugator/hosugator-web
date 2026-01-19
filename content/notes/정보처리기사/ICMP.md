---
created: 2025-10-27
tags:
  - 정보처리기사
  - icmp
reference:
---
# Internet Control Message Protocol
## 정의
IP 통신 문제 진단/보고 특화 프로토콜
## 원리
[[IP]] 통신을 제어하지 않으나, 오류를 탐지하여 헤더에 담아 메세지로 송신자에게 전달한다.
- 형식: 8바이트의 헤더 영역, 가변 길이의 데이터 영역
## 예시
- 네트워크 연결 확인(Echo Request/Reply): [[Ping]] 등의 도구로 확인하여 발생한다.
- 시간 초과(Time Exceeding): 패킷의 [[TTL]] 제한 등으로 발생한다.
- 목적지 도달 불가(Destination Unreachable): 패킷을 더 이상 전달 불가할 때 발생한다.
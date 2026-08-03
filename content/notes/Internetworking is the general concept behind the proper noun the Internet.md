---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - network
  - internet
  - terminology
publish: true
---
## Context
HTTP/네트워크 계층을 하나씩 정리하다가 "인터넷이 외부 공용망만 가리키는 고유명사인지, 아니면 IP로 두 객체를 연결하는 더 큰 개념인지"가 헷갈렸다.

## Insight
### "internet"은 inter+network, 즉 "네트워크들을 서로 연결한다"는 일반개념에서 나왔다
우리가 흔히 말하는 the Internet(고유명사, 전 세계 공용망)은 이 일반개념이 지구 규모로 구현된 하나의 특정 사례이다.
사설망끼리의 연결(k8s 클러스터 내부망, 회사 사내망, VPN으로 묶은 두 사무실)도 개념적으로는 동일한 internetworking이다 — 규모와 공개 여부만 다르다.

### 이 구분의 실무적 쓸모: "인터넷=공인 IP 필요"라는 오해 방지
IP 기반으로 네트워크와 네트워크를 잇는 행위 자체가 internetworking이므로, 클러스터 내부 오버레이 네트워크(VXLAN 등)나 사설 VPN도 "인터넷"이다. 
the Internet이라는 특정 사례의 속성(공인 주소, 전 지구적 라우팅)은 internetworking 자체의 필수조건이 아니다.

## Related
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]]
- [[NodePort exposes hardware-level ports while ClusterIP ports are namespace-scoped]]
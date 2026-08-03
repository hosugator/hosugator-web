---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - network
  - virtual-ip
  - kubernetes
publish: true
---
## Context
"네트워크의 정의(노드+링크+프로토콜)"를 논하다가 "가상 IP를 가진 두 객체가 같은 물리 하드웨어 위에서 통신하는 것도 통신인가?"라는 질문에 k8s Pod 예시로 답했다.
이후 "논리적으로 분리된 노드 내부에서만 자기완결적으로 수행되는 작업이 아닌 한 네트워크가 필수적이다"라는 일반화로 이어졌는데, 이 경계선의 정확한 기준을 정립했다.

## Insight
### "노드 분리"의 기준은 물리적 하드웨어가 아니라 독립된 주소/상태 공간이다
k8s의 같은 물리 노드 위 두 Pod는 각자 별도의 네트워크 네임스페이스(독립 IP, 라우팅 테이블)를 가진다.
통신 경로는 veth pair(가상 케이블) + Linux bridge(가상 스위치) — 물리 NIC를 전혀 거치지 않지만, 패킷은 여전히 완전한 IP 패킷 형태를 갖추고 IP 계층의 라우팅 결정을 실제로 거친다.
이건 [[k8s namespace and node are orthogonal axes, pod exists at their intersection]]에서 정리한 "namespace는 논리적 울타리이지 물리적 분리가 아니다"를 네트워킹 관점에서 재확인하는 사례다.

### 반례처럼 보이지만 아닌 경우: 공유 메모리 IPC
같은 프로세스 내 스레드나 공유메모리로 통신하는 프로세스는 애초에 "독립된 주소공간"이 아니라 "메모리를 빌려 하나처럼 만든 것"이라 네트워크가 불필요하다.
Unix domain socket처럼 파일시스템 경로로 식별하는 로컬 IPC도 애매한 경계 — IP 주소 없이 커널이 중개하는 로컬 통신 채널이라 엄밀한 "네트워크"(주소화된 노드 간 프로토콜)와는 다르다.

### 정제된 명제
"분리되어 있어서"가 아니라 "서로 독립적으로 주소화(addressable)되어야 하는 두 실체 간 데이터 교환"이 아닌 한 네트워크(주소+링크+프로토콜)가 필수는 아니다.
k8s Pod가 네트워크를 필요로 한 이유는 단순 분리가 아니라, 각자 독립된 IP로 식별되고 클러스터 어디서든 도달 가능해야 하는 요구사항 때문이었다.

## Related
- [[k8s namespace and node are orthogonal axes, pod exists at their intersection]] — namespace가 논리적 울타리라는 전제를 네트워킹 관점으로 확장
- [[A cluster is the hard isolation boundary between domains while a namespace divides within one]] — 격리 경계의 상위 층위 비교

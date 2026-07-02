---
created: 2026-06-23
updated: 2026-06-23
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - networking
  - linux
publish: true
---
## Context
Kubernetes Service의 트래픽 분산 방식이 특정 알고리즘에 의존한다는 걸 처음 이해했다. kube-proxy가 iptables와 IPVS 중 하나를 사용한다는 구조를 파고들면서 둘의 차이를 정리했다.

## Insight
### iptables는 규칙 목록을 선형 탐색하는 패킷 필터다

iptables는 리눅스 커널에 내장된 패킷 처리 메커니즘으로, 패킷이 들어오면 규칙 목록을 위에서부터 순차 탐색해 매칭 규칙을 적용한다. Pod가 100개면 규칙도 100개이므로 탐색이 O(n)이다.
kube-proxy는 기본적으로 iptables를 써서 Service IP → Pod IP NAT 규칙을 심는다. 분산 방식은 **확률 기반 랜덤**이다. Pod 3개면 각각 33% 확률로 연결되며, 요청 수가 적으면 실제 분포가 불균등해질 수 있다.

### IPVS는 해시 테이블로 Pod 수에 무관하게 O(1) 라우팅을 제공한다

IPVS(IP Virtual Server)는 리눅스 커널의 L4 로드밸런서 모듈이다. 내부적으로 해시 테이블을 사용해 Pod 수가 늘어나도 탐색 시간이 일정하다.

kube-proxy를 IPVS 모드로 전환하면 스케줄링 알고리즘을 선택할 수 있다:

```bash
--ipvs-scheduler=rr   # round-robin (기본)
--ipvs-scheduler=lc   # least connection
--ipvs-scheduler=sh   # source hash — 같은 클라이언트 → 같은 Pod
```

### Pod 수가 적으면 iptables와 IPVS의 차이는 미미하다

Pod 수십 개 수준에서는 성능 차이가 거의 없다. IPVS가 의미 있는 것은 Pod 수백~수천 규모의 대형 클러스터다.

## Related
- [[k8s core components each have a single responsibility across control and data planes]] — kube-proxy가 네트워크 라우팅 담당 컴포넌트임을 정리한 노트
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — kube-proxy가 라우팅하는 Service 타입 구조

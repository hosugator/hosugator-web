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
  - service
publish: true
---
## Context
kube-proxy의 트래픽 분산 방식을 이해하다가 "왜 URL 경로별 라우팅이 Service만으로는 안 되는가"라는 질문에 부딪혔다. L4와 L7의 경계를 구체적으로 정리했다.

## Insight
### L4 Service는 TCP 연결 단위로만 Pod를 선택한다

Kubernetes Service는 L4(TCP/UDP) 레벨에서 동작한다. 볼 수 있는 정보는 IP 주소와 포트 번호뿐이다.

```
L4가 보는 것: IP 주소, 포트 번호, TCP 연결 여부
L4가 못 보는 것: URL 경로, HTTP 헤더, 쿠키, HTTP 메서드
```

TCP 연결이 맺어지면 그 안에 `/api`가 있는지 `/web`이 있는지 열어보지 않고 Pod 하나에 붙인다. URL 경로 구분 자체가 HTTP 파싱을 요구하는 L7 기능이다.

### HTTP 수준 라우팅은 L7 레이어가 필요하다

| 요구사항 | 해결책 | 레이어 |
|---|---|---|
| URL 경로별 라우팅 (`/api`, `/web`) | Ingress | L7 |
| 가중치 기반, 헤더 기반 | Istio / Envoy | L7 |
| 세션 고정 (sticky session) | IPVS `sh` 또는 Ingress annotation | L4/L7 |

Ingress와 Istio는 HTTP 패킷을 파싱할 수 있어서 경로·헤더·쿠키를 기준으로 라우팅 결정을 내릴 수 있다.

### 스케줄러가 자원 적합성을 보장하므로 Service는 Ready 상태만 확인한다

Pod가 Running + Ready 상태라는 것은 kubelet이 자원 할당을 완료했다는 신호다. Service는 "Ready면 처리 가능"으로 판단하고 자원 잔량을 보지 않는다. 자원 판단 책임은 스케줄러에게, 가용성 판단 책임은 Service에게 위임된 구조다.

## Related
- [[iptables scans rules linearly while IPVS uses hash lookup making it faster at pod scale]] — kube-proxy의 실제 분산 메커니즘
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — Service 타입 계층 구조
- [[k8s core components each have a single responsibility across control and data planes]] — 각 컴포넌트 책임 분리 구조

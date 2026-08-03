---
created: 2026-07-16
updated: 2026-07-16
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - kubernetes
  - service
  - ingress
  - networking
publish: true
---
## Context
"Ingress가 Service까지 담당하면 편리하지 않냐"는 질문에서 출발해, 왜 k8s가 이 둘을 분리했는지 정리했다. 결론은 "핵심은 Service, Ingress는 부가적 진입 통로"라는 비대칭 관계였다.

## Insight
### Service는 Ingress 없이도 존재 이유가 있지만, 그 반대는 아니다
- Pod-to-Pod 내부 통신에도 Service가 필요하다 (예: FastAPI Pod → `postgres-service`) — 이건 외부 트래픽이 아니라 Ingress와 무관.
- Service는 프로토콜을 가리지 않는다(L4) — HTTP든 Redis 프로토콜이든 DB 와이어 프로토콜이든 Pod만 찾아서 로드밸런싱한다. Ingress는 HTTP를 파싱해야만 동작하는 L7 전용이라 이 역할을 대신할 수 없다.
- Service는 `type: NodePort`/`LoadBalancer`로 Ingress 없이도 외부에 직접 노출 가능하다 — Ingress는 "여러 HTTP 앱을 하나의 진입점에서 도메인/경로로 나누고 싶을 때" 얹는 선택적 편의 계층일 뿐이다.

### 합치지 않는 이유: Ingress를 거치지 않는 트래픽이 압도적으로 많다
Ingress Controller가 Service 역할(Pod 선택)까지 흡수했다면, HTTP가 아닌 트래픽이나 순수 내부 Pod-to-Pod 트래픽은 로드밸런싱 자체를 받을 방법이 없어진다.
Service는 Ingress를 포함해 여러 소비자(다른 Pod, Job, 여러 Ingress 규칙)가 공유하는 더 근본적인 부품이라 별도로 유지된다.

## Related
- [[Kubernetes scaling and application protocol choice solve orthogonal problems]] — Service(로드밸런싱)와 프로토콜 선택이 별개 축이라는 논의의 연장
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]] — L4/L7 역할 분리가 이 노트의 전제

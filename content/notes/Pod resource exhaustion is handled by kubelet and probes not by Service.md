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
  - reliability
publish: true
---
## Context
Service가 Pod의 자원을 보지 않는다는 걸 이해한 뒤, 그러면 자원이 고갈된 Pod는 누가 처리하는지 궁금해졌다. Service가 끊는 게 아니라면 어떤 메커니즘이 동작하는가를 파고들었다.

## Insight
### 자원 초과 처리는 kubelet이 담당하고 Service는 probe 결과를 따른다

```
메모리 limit 초과 → OOMKilled: kubelet이 Pod 강제 종료
CPU limit 초과   → CPU throttling: 속도만 줄임, Pod 종료 없음
Pod 종료         → Readiness probe 실패 → Service endpoint 목록에서 자동 제외
```

Service는 자원을 직접 감시하지 않는다. Pod가 Readiness probe를 통과하는지만 본다. 자원 문제로 Pod가 죽으면 probe가 실패하고, 그 결과로 Service가 해당 Pod를 목록에서 뺀다 — 자원 처리와 트래픽 격리가 직접 연결되지 않고 probe를 통해 간접 연결된다.

### OOMKilled와 CPU throttle은 동작 방식이 다르다

- **OOMKilled**: 메모리는 압축이 불가하므로 커널이 프로세스를 강제 종료한다. Pod가 죽고 재시작된다.
- **CPU throttle**: CPU 시간을 제한해 속도를 줄이지만 프로세스는 살아있다. 느려질 뿐 종료되지 않는다.

메모리는 이진(있거나 없거나), CPU는 조절 가능(느리게라도 쓸 수 있다)한 특성 때문에 처리 방식이 다르다.

## Related
- [[Kubernetes Service L4 boundary prevents HTTP path and header routing without Ingress]] — Service가 자원을 보지 않는 이유: 스케줄러가 이미 자원 적합성을 보장
- [[k8s core components each have a single responsibility across control and data planes]] — kubelet의 역할: Pod 생성·상태 관리, 컨테이너 런타임과 통신
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — limit 설정 자체의 의미와 구조

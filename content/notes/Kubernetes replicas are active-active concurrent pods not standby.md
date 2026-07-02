---
created: 2026-06-12
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - replica
  - load-balancing
publish: true
---
## Context
align-ai k3s 실습 중 replica=2 설정 시 "한 pod가 대기하다가 다른 pod가 죽으면 활성화된다"고 이해했다. 이 오해는 Service의 트래픽 분산 동작을 잘못 예측하게 만든다.

## Insight
### replica는 standby pool이 아니라 active-active 동시 실행이다

replica=2면 두 pod가 동시에 실행 중이고 Service가 트래픽을 양쪽으로 분산한다. 한 pod가 죽었을 때 흐름:

```
1. Pod A 크래시
2. Service: Pod A 제외 → 모든 트래픽 Pod B로
3. k8s: Pod A 재시작 (self-healing)
4. Pod A readiness probe 통과
5. Service: Pod A 다시 로드밸런싱 풀 복귀
```

Pod A가 처리하던 요청은 드롭된다. 다음 요청부터 Pod B가 받는다.

### 트래픽 분산은 Service가, 배치는 스케줄러가 담당한다

두 역할은 완전히 분리되어 있다.

| 담당 | 역할 |
|---|---|
| 스케줄러 | pod를 어느 노드에 배치할지 결정 |
| Service | 살아있는 pod들에 트래픽을 분산 |

"replica를 늘리면 스케줄러가 트래픽을 나눈다"는 흔한 오해다. 스케줄러는 실행 위치만 결정하고, 실행 이후 트래픽 경로는 Service가 관리한다.

## Related
- [[Node-level HA and pod-level self-healing address different failure layers]] — self-healing이 replica 복구에서 어떻게 작동하는지
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — Service가 트래픽을 분산하는 구조
- [[Stateless design makes any instance interchangeable by externalizing state]] — pod가 교체·재시작되어도 동작이 유지되는 전제 조건

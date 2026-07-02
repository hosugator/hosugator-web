---
created: 2026-06-10
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - architecture
  - stateless
publish: true
---
## Context
k8s 현장 배포에서 팟이 재시작되거나 replica 간에 요청이 분산될 때, 설비 메타데이터가 올바르게 처리되는지 논의하면서 stateless 설계 원칙의 의미를 처음으로 명확히 이해했다.

## Insight
### 인스턴스 교체 가능성은 상태가 어디에 있느냐가 결정한다

```
Stateful (문제)
  pod 메모리에 설비 메타데이터 캐싱
  → pod 죽으면 캐시도 사라짐
  → 재시작된 pod가 이어받지 못함

Stateless (올바른 설계)
  요청 자체에 메타데이터 포함 (or 외부 DB에서 조회)
  → 어느 pod가 받아도 동일하게 처리 가능
  → pod 교체·재시작이 서비스에 영향 없음
```

### 상태를 둘 수 있는 위치

| 위치               | pod 재시작 후 | 특징                  |
| ---------------- | --------- | ------------------- |
| pod 메모리          | 사라짐       | 빠름. stateful 위험     |
| 외부 DB            | 유지        | 구조화된 데이터            |
| PersistentVolume | 유지        | 파일·바이너리             |
| 요청 자체            | —         | 가장 단순. 클라이언트가 맥락 포함 |

### stateless가 self-healing과 scaling을 가능하게 한다

pod가 무상태이면 k8s가 아무 pod나 죽이고 새로 띄워도 서비스가 유지된다. replica를 늘려도 어느 pod가 요청을 받든 동일한 결과다. 상태가 pod 안에 있으면 특정 pod가 죽으면 안 되는 구조가 돼서 self-healing과 autoscaling의 전제가 무너진다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 현장 배포에서 설비 메타데이터 stateless 처리 맥락
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — stateless pod를 자동 복구하는 self-healing 메커니즘
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — stateless pod들 사이에서 트래픽을 분산하는 Service

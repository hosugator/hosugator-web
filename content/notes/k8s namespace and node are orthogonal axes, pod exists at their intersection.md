---
created: 2026-06-11
updated: 2026-06-11
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - namespace
  - node
publish: true
---
## Context
하나의 게이트웨이 PC(노드)에 여러 모델(Argo CD Application)이 올라갈 때, namespace와 node가 어떻게 관계되는지 혼동됐다. "클러스터 → 노드 → 네임스페이스 → Pod"처럼 단일 계층으로 이해하고 있었는데 틀렸다.

## Insight
### namespace와 node는 다른 축이다 — Pod가 교차점에 존재한다

```
클러스터
  ├── 물리 축: 노드 (어느 PC에서 실행되는가)
  │     ├── node-A
  │     └── node-B
  │
  └── 논리 축: 네임스페이스 (누구의 리소스인가)
        ├── namespace: align-ai
        └── namespace: anomaly-ai
```

Pod는 두 축이 교차하는 지점이다. `align-ai` namespace의 Pod가 `node-A`에 스케줄될 수도, `node-B`에 스케줄될 수도 있다. namespace가 같아도 다른 노드에서 실행될 수 있고, 같은 노드에 다른 namespace의 Pod가 함께 돌 수 있다.

### namespace는 논리적 울타리다 — 격리이지 물리적 분리가 아니다

#### namespace가 제공하는 것:

- **이름 충돌 방지**: 두 모델이 모두 `deployment`라는 이름을 써도 namespace가 다르면 충돌 없음
- **권한 경계**: RBAC으로 namespace별 접근 제어
- **리소스 쿼터**: namespace별 CPU/메모리 상한 설정 가능

#### namespace가 제공하지 않는 것:

- 물리적 노드 분리 (그건 nodeSelector, taint/toleration의 역할)
- 네트워크 격리 (그건 NetworkPolicy의 역할)

### app이 늘어나는 시점에 namespace의 역할이 체감된다

앱이 하나일 때는 namespace가 불필요하게 느껴진다. 두 번째 앱이 추가되는 순간 이름 충돌 방지가 필요해지고, namespace의 존재 이유가 직관적으로 이해된다.

## Related
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — Argo CD Application이 namespace를 destination으로 지정하는 구조
- [[Kubernetes Deployment manifest layers desired state onto containers through labels and selectors]] — Deployment가 namespace 안에서 동작하는 방식
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — 같은 노드에서 namespace들이 리소스를 나누는 방법

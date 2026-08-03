---
created: 2026-06-09
updated: 2026-07-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - k8s
  - resource
  - limits
publish: true
---
## Context
align-ai inference pod를 현장 설비에 배포할 때 다른 프로세스에 영향을 주지 않도록 resource limits를 설정해야 한다는 것을 배웠다.

## Insight
### requests는 하한, limits는 상한이다

```
requests  → 스케줄러가 노드 배치 시 참고하는 최소 보장량
limits    → 초과 불가 상한선
```

> **정정 (2026-07-29)**: requests의 역할을 스케줄링 시점으로만 이해한 것은 불완전했다.
> requests는 런타임 내내 `cpu.weight`(cgroup 가중치)로 살아있고, **경합 시 실제 배분 비율을 결정한다.**
> 자세히는 [[CPU contention is decided by requests weight not by limits]]

초과 시 동작:
- CPU: throttle (속도 제한, 종료 없음)
- memory: OOMKill (pod 강제 종료)

### 명시하지 않으면 무제한이다

k8s는 limits를 선언하지 않으면 노드 전체 자원을 쓸 수 있다. 현장 설비처럼 다른 프로세스와 자원을 공유하는 환경에서는 반드시 명시해야 한다.

```yaml
resources:
  requests:
    cpu: "500m"      # 0.5 코어 보장 (milli-core 단위)
    memory: "512Mi"
  limits:
    cpu: "1000m"     # 최대 1 코어
    memory: "1Gi"
```

`500m` = 1 코어의 절반 (milli-core).

### 현장 배포에서 중요한 이유

```
limits 없을 때
  → inference pod가 갑자기 CPU 100% 점유
  → 같은 노드의 OS, 다른 앱 모두 느려짐
  → 설비 전체 영향
```

> **정정 (2026-07-29)**: 이 인과는 CPU에서 성립하지 않는다. 2 vCPU k3s 노드의 cgroup을 직접 읽어 확인했다.
>
> - **CPU limits는 co-tenant를 보호하지 않는다.** 쿼터는 자기 자신에게만 작용하고 다른 파드의 가중치 비율은 그대로다. 얻는 건 자기 tail latency 악화뿐이다.
> - 같은 노드의 **OS·컨트롤 플레인은 `system.slice`에 있어 애초에 다른 cgroup 버킷**이다. 파드가 폭주해도 구조적으로 보호된다.
> - 옆 파드를 보호하는 실제 장치는 **보호받을 쪽에 requests를 주는 것**이다.
>
> 위 인과가 성립하는 경우는 **메모리**다. 메모리는 압축 불가라서 limits 없으면 노드 전체가 OOM 위험에 놓인다.
> → [[CPU contention is decided by requests weight not by limits]] · [[The control plane is protected by cgroup slice separation not by resource settings]]

## Related
- [[CPU contention is decided by requests weight not by limits]] — 이 노트의 CPU 쪽 인과를 정정하는 노트
- [[A CPU limit throttles in fixed periods so it inflates tail latency]] — limits를 걸었을 때 실제로 일어나는 일
- [[The control plane is protected by cgroup slice separation not by resource settings]] — OS·컨트롤 플레인이 보호되는 진짜 이유
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — 같이 deployment.yaml에 추가하는 설정
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 현장 배포 맥락

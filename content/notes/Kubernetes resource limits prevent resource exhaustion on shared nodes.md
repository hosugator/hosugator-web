---
created: 2026-06-09
updated: 2026-06-09
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

## Related
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — 같이 deployment.yaml에 추가하는 설정
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 현장 배포 맥락

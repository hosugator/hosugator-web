---
created: 2026-06-29
updated: 2026-06-29
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - probe
  - hpa
  - self-healing
  - patterns
publish: true
---
## Context
align-ai inference pod 운영 중 liveness/readiness probe 역할 차이를 탐구. 자원 과부하 시 자동 대응 방식과 auto-scaling의 별도 구현 필요성까지 확장.

## Insight
### Kubernetes는 Pod 관리를 세 가지 독립 메커니즘으로 분리한다

```
liveness probe  → "이 Pod가 살아있냐"       실패 시: 재시작
readiness probe → "트래픽 받을 준비 됐냐"   실패 시: Service 엔드포인트 제외
HPA             → "Pod 수를 늘려야 하냐"     임계 초과 시: replica 증설
```

| 메커니즘 | 관심사 | 실패/임계 시 행동 | 설정 위치 |
|---|---|---|---|
| liveness | Pod 정상 상태 | 컨테이너 재시작 | deployment.yaml |
| readiness | 트래픽 수용 가능성 | Service에서 제외 | deployment.yaml |
| HPA | 부하 기반 스케일링 | replica 수 증설 | 별도 HPA 오브젝트 |

세 가지는 서로 독립적으로 동작한다. readiness 실패가 새 Pod 생성을 트리거하지 않고, liveness 실패가 트래픽을 조절하지 않는다.

### liveness에 자원 모니터링을 넣는 것은 안티패턴이다

```
자원 과부하 → liveness 실패 → 재시작
→ 재시작 중 Pod 0개 → 트래픽 집중 → 또 과부하 → 반복 (cascade failure)
```

재시작은 "프로세스가 근본적으로 망가진" 경우의 마지막 수단이다. 과부하는 망가진 상태가 아니므로 재시작으로 해결되지 않는다.

자원 문제의 올바른 처리 경로:

```
메모리 한도 초과 → OOMKiller → 자동 재시작     (resource limits 담당)
일시 과부하      → readiness 실패 → 트래픽 차단  (probe 담당)
트래픽 과부하    → HPA → replica 증설            (별도 설정 필요)
```

## Related
- [[Kubernetes liveness and readiness probes catch failures that process existence cannot]] — liveness/readiness 세부 동작 원리
- [[Node-level HA and pod-level self-healing address different failure layers]] — self-healing이 노드 HA와 다른 층위를 담당한다는 관점
- [[Pod resource exhaustion is handled by kubelet and probes not by Service]] — 자원 고갈 시 kubelet/probe 처리 메커니즘 상세
- [[Kubernetes replicas are active-active concurrent pods not standby]] — replica 증설 시 트래픽 분산 구조

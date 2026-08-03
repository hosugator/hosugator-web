---
created: 2026-07-29
updated: 2026-07-29
type: insight
status: 2-stable
subject: "[[Infra]]"
project:
tags:
  - kubernetes
  - k8s
  - cgroup
  - cfs
  - latency
publish: true
---
## Context

2 vCPU 노드에 PatchCore 추론(CPU 시간 400ms+ 소요) 데모를 올릴지 판단하려고 로컬에서 벤치마크를 돌렸다. `onnxruntime`의 `intra_op_num_threads=2`로 묶어 "노드와 같은 조건"이라 여기고 432ms / P95 504ms를 얻었다.

그 숫자가 배포 환경을 예측하지 못한다는 걸 나중에 알았다. **스레드 수를 제한하는 것과 cgroup 쿼터를 거는 것은 다른 일이다.**

## Insight

### limits.cpu는 상한이 아니라 주기당 예산이다

`limits.cpu`는 CFS(Completely Fair Scheduler) 대역폭 제어의 쿼터로 번역된다. 값이 두 개다.

```
cpu.cfs_period_us   주기, 기본 100ms
cpu.cfs_quota_us    그 주기 안에 쓸 수 있는 CPU 시간
```

cgroup v2에서는 `cpu.max`에 `"<quota> <period>"` 한 줄로 들어간다 (`max`면 무제한).

| limits.cpu | 100ms 주기당 허용 CPU 시간 |
|---|---|
| `500m` | 50ms |
| `1000m` | 100ms |
| `1500m` | 150ms |

**핵심은 쿼터가 벽시계가 아니라 CPU 시간 총합이라는 점이다.** 스레드 2개가 동시에 돌면 벽시계 50ms만 지나도 예산 100ms를 태운다. 그래서 병렬화가 쿼터 환경에서는 배신한다.

### 쿼터를 소진하면 코어가 비어 있어도 대기한다

주기 안에서 예산을 다 쓰면 그 cgroup의 **모든 스레드가 다음 주기 시작까지 런큐에서 내려간다.** 노드가 유휴여도 못 쓴다.

CPU 시간 800ms가 필요한 작업에 `limits.cpu: 1500m`을 걸면:

```
주기당 150ms  →  800 / 150 ≈ 6주기  →  벽시계 약 600ms
계산은 400ms면 끝나는데 스로틀 대기 200ms가 얹힌다
```

### 지연이 주기 경계에 양자화되므로 평균이 아니라 P95가 무너진다

요청이 주기 중간에 도착하면 남은 예산에 따라 결과가 달라진다. 평균은 견딜 만해도 P95·P99가 눈에 띄게 부풀어 오른다. 그리고 **스레드 수만 지정한 벤치마크에는 이 효과가 전혀 잡히지 않는다** — 내가 얻은 432ms가 정확히 그 함정이었다.

교훈: 쿼터가 걸릴 환경을 예측하려면 벤치마크도 쿼터를 걸어야 한다. 아키텍처가 달라도(x86에서 arm64를 추정하는 상황이어도) 스로틀 거동 자체는 같은 성질이므로 `docker run --cpus=1.5` 정도로 값싸게 확인할 수 있다.

### 병렬화가 역효과일 수 있다

스레드를 늘려 벽시계를 줄이려 해도 예산 소진만 빨라져 스로틀 대기로 상쇄된다. limit이 걸린 환경에서는 스레드 수를 쿼터에 맞춰 **낮추는** 게 오히려 P95에 유리한 경우가 있다. 직관과 반대다.

### requests와 limits는 다른 커널 기능이다

| | 커널 장치 | 초과 가능? | 초과 시 |
|---|---|---|---|
| `requests.cpu` | `cpu.weight` (가중치) | 가능 — 노드가 한가하면 초과 사용 | — |
| `limits.cpu` | `cpu.max` (쿼터) | 불가 — 노드가 놀아도 못 씀 | 스로틀 대기 |
| `limits.memory` | `memory.max` | 불가 | **OOMKill** |

CPU limit 초과는 죽이지 않고 느려지게 만들고, 메모리 limit 초과는 즉사시킨다. 같은 `limits` 필드인데 성질이 전혀 다르다.

### 진단은 cpu.stat으로 한다

cgroup v2 기준 `/sys/fs/cgroup/cpu.stat`:

```
nr_periods       지난 주기 수
nr_throttled     그중 스로틀된 주기 수
throttled_usec   스로틀 대기 누적 시간
```

`nr_throttled / nr_periods`가 스로틀 비율이다. 노드 전체로는 cAdvisor의 `container_cpu_cfs_throttled_periods_total`.

## Decision

**CPU 바운드이면서 지연이 중요한 워크로드에는 `limits.cpu`를 걸지 않고 `requests`로만 관리한다.**

**이유**: limit이 없으면 스로틀링이 사라지고, 노드가 붐빌 때는 가중치 비율로 나눠 갖는다. 지연 민감 컴포넌트 보호는 그쪽에 requests를 주는 것으로 해결한다 → [[CPU contention is decided by requests weight not by limits]]

**전환 조건**: 신뢰할 수 없는 워크로드이거나 코어 수가 적어 단일 폭주가 노드를 마비시킬 수 있으면 쿼터가 필요하다. 그때도 P95 악화를 감수하는 거래임을 인지하고 걸어야 한다.

## Related

- [[CPU contention is decided by requests weight not by limits]] — 보호 메커니즘의 정체. 이 노트와 짝
- [[The control plane is protected by cgroup slice separation not by resource settings]] — 슬라이스 레벨에는 쿼터가 걸려있지 않았다(`cpu.max = max`)
- [[CPU Scheduling Algorithm]] — CFS의 상위 계보. 선점형 스케줄러 위에 대역폭 제어가 얹힌 구조
- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — limits를 단순 상한으로 이해했던 이전 노트
- [[Application Performance Metrics]] — 평균이 아니라 tail로 봐야 하는 이유

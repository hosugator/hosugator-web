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
  - resource
  - scheduling
publish: true
---
## Context

hosugator-infra(Oracle Always Free, 2 vCPU arm64, k3s 단일 노드)에 PatchCore 추론 데모를 추가할지 검토했다. 측정값은 ONNX 기준 피크 RSS 1.06GiB, 2스레드 지연 432ms — 추론 중 두 코어를 다 쓴다.

그래서 "데모에 `limits.cpu: 1500m`을 걸어 ingress(Traefik)가 굶지 않게 하자"고 판단했다. 노드의 cgroup을 직접 읽어보니 그 판단은 **메커니즘을 잘못 짚은 것**이었다.

## Insight

### requests는 하한 보장이 아니라 경합 시 배분 가중치다

`requests`를 "최소 보장량"으로만 이해하면 스케줄링 시점의 역할만 보는 것이다. 실제로는 **런타임 내내 cgroup 가중치로 살아있다.** 두 단계로 변환된다.

```
1단계   shares = max(2, milliCPU × 1024 / 1000)
2단계   weight = ((shares - 2) × 9999) / 262142 + 1        # 정수 나눗셈
```

`cpu: 100m` → shares 102 → **weight 4**. 숫자가 그대로 넘어가지 않는다.

실제 노드에서 읽은 값 세 개가 모두 이 공식으로 재현됐다:

| cgroup | 입력 | 계산 | 실측 |
|---|---|---|---|
| `kubepods.slice` | allocatable 2000m | shares 2048 → 79 | **79** |
| `kubepods-burstable.slice` | requests 합 550m | shares 563 → 22 | **22** |
| `kubepods-besteffort.slice` | requests 없음 → shares 2 | 1 | **1** |

공식이 맞다는 걸 실측으로 확인했다는 점이 중요하다. 문서를 믿는 게 아니라 노드를 읽어서 검증했다.

### requests를 생략하면 가중치가 바닥값 1로 떨어진다

`(2-2) × 9999 / 262142 + 1 = 1`. requests가 없으면 QoS가 BestEffort가 되고 가중치는 최소값이다.

그 클러스터에서 Traefik과 ArgoCD 전체가 이 상태였다. 아무도 "이건 급하지 않으니 낮게 두자"고 결정한 게 아니다 — k3s 번들 Helm 차트가 `resources`를 비워둔 기본값이고 `HelmChartConfig`가 없었다. **결정의 부재가 최악의 가중치로 귀결된 것이다.**

### limits는 co-tenant를 보호하지 않는다

이게 내가 틀렸던 지점이다. `limits`는 CFS 쿼터로 **자기 자신에게만** 작용한다. 데모에 쿼터를 걸어도 다른 파드의 가중치 비율은 그대로다. 얻는 건 데모의 tail latency 악화뿐이다 → [[A CPU limit throttles in fixed periods so it inflates tail latency]]

co-tenant를 보호하는 장치는 두 개다:
- **가중치** — 보호받을 쪽에 `requests`를 주는 것
- **슬라이스 분리** — 애초에 다른 cgroup에 있는 것 → [[The control plane is protected by cgroup slice separation not by resource settings]]

### QoS 클래스 이동 효과가 개별 가중치 숫자보다 크다

QoS는 선언이 아니라 requests/limits 조합의 **결과**다.

| 클래스 | 조건 |
|---|---|
| Guaranteed | 모든 컨테이너에 requests == limits |
| Burstable | requests가 있고 Guaranteed 조건 미충족 |
| BestEffort | requests·limits 둘 다 없음 |

그리고 클래스별로 **슬라이스가 갈리고, 슬라이스 자체에 가중치가 붙는다.** Traefik에 `100m`을 주면 개별 가중치는 4에 불과하지만, `besteffort.slice`(전체 weight 1, ArgoCD 7개와 공유)에서 `burstable.slice`(weight 22→26)로 이사한다. 노드 지분이 약 0.2% → 약 6%로 30배 가까이 바뀐다.

그래서 실무 판단은 단순하다: **정확한 값 튜닝보다 0에서 벗어나는 것 자체가 대부분의 효과를 낸다.**

### CPU는 압축 가능한 자원이라 "남겨둔다"의 의미가 메모리와 다르다

| | 부족하면 | "남겨둔다"의 실체 |
|---|---|---|
| 메모리 | OOMKill — 즉사 | 실제로 비워두는 것 |
| CPU | 느려질 뿐 | 예약된 코어가 아니라 **경합 시 배분 비율** |

메모리에서는 여유분이 실체를 갖지만, CPU에서는 비율일 뿐이다. 노드가 한가하면 requests 이상 써도 된다. 이 차이를 뭉개면 "CPU를 남겨두려면 limits를 걸어야 한다"는 잘못된 결론에 도달한다 — 내가 그랬다.

## Decision

**보호가 필요한 쪽에 requests를 주고, 무거운 워크로드에는 CPU limits를 걸지 않는다.**

hosugator-infra 기준 구체적 순서:
1. Traefik에 `requests.cpu: 100m` 부여 (`HelmChartConfig`로 — Deployment 직접 수정은 k3s Helm 컨트롤러가 되돌린다)
2. ArgoCD는 BestEffort 유지 — reconciliation 루프라 지연이 동기화 시점만 늦추고 사용자 경로에 없다
3. 그 다음 무거운 추론 파드를 올리되 `limits.cpu`는 생략

**이유**: 쿼터는 자기만 굶기고, 보호는 가중치와 슬라이스 구조에서 나온다.

**전환 조건**: 노드가 멀티테넌트가 되거나 신뢰할 수 없는 워크로드가 들어오면 limits가 필요해진다. 쿼터의 진짜 용도는 "co-tenant 보호"가 아니라 **"폭주하는 단일 워크로드의 상한 강제"** 다.

(적용은 아직 하지 않았다 — 프로덕션 클러스터라 승인 대기 중.)

## Related

- [[Kubernetes resource limits prevent resource exhaustion on shared nodes]] — 이 노트가 정정하는 이전 이해. "limits가 co-tenant를 보호한다"는 핵심 주장이 CPU에서는 성립하지 않는다
- [[A CPU limit throttles in fixed periods so it inflates tail latency]] — limits 쪽 메커니즘 상세
- [[The control plane is protected by cgroup slice separation not by resource settings]] — 가중치 외의 다른 보호 축
- [[Pod resource exhaustion is handled by kubelet and probes not by Service]] — 자원 고갈의 처리 주체 구분
- [[CPU Scheduling Algorithm]] — CFS가 속한 스케줄링 알고리즘 계보

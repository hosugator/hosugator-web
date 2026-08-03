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
  - k3s
  - cgroup
  - control-plane
publish: true
---
## Context

2 vCPU 단일 노드 k3s에 무거운 추론 파드를 올리려다 걱정이 생겼다 — 컨트롤 플레인과 ArgoCD가 쓸 CPU는 항상 남아 있어야 하지 않나? 노드의 cgroup 계층을 직접 읽어서 확인했다.

## Insight

### 컨트롤 플레인은 파드가 아니라 systemd 서비스라서 다른 버킷에 있다

k3s 프로세스의 cgroup을 확인했더니 `/system.slice/k3s.service`였다. apiserver·controller-manager·scheduler·kubelet이 전부 k3s 단일 서비스 안에 있고, **`kubepods.slice`의 형제 cgroup**이다.

실측한 최상위 계층:

```
/ (root)
├─ system.slice          weight=100   ← k3s.service (컨트롤 플레인 전체)
├─ kubepods.slice        weight= 79   ← 모든 파드
│   ├─ burstable.slice   weight= 22
│   └─ besteffort.slice  weight=  1
└─ user.slice            weight=100

모든 슬라이스: cpu.max = max   (쿼터 없음 = 순수 가중치 경합)
```

**컨트롤 플레인이 파드보다 높은 가중치를 갖는다(100 vs 79).** 아무 설정 없이 얻는 구조적 보호다. 데모가 두 코어를 다 태워도 컨트롤 플레인은 별도 버킷에서 더 큰 지분으로 시간을 받는다.

그래서 `--kube-reserved`/`--system-reserved`가 설정돼 있지 않아도(그 노드는 `capacity == allocatable == 2`로 예약분이 0이었다) 컨트롤 플레인이 버틴다. 스케줄러 관점의 예약과 런타임 CPU 배분은 다른 층위의 문제다.

### 보호 여부는 "파드인가 아닌가"로 갈린다

역설적 결과가 나온다. 걱정했던 컨트롤 플레인은 안전하고, **파드로 도는 클러스터 기본 컴포넌트가 위험하다.**

그 클러스터에서 Traefik과 ArgoCD 전체가 requests 없는 BestEffort였다. `besteffort.slice` 전체가 weight 1이고 그것을 8개 파드가 나눠 갖는다 → 완전 포화 시 Traefik 지분이 노드의 약 0.2%.

즉 "클러스터 운영 컴포넌트"라는 하나의 범주로 묶어 생각하면 안 된다. **k3s 바이너리 안에 있는 것과 파드로 배포된 것의 처지가 완전히 다르다.**

### PriorityClass는 CPU 배분과 무관하다

Traefik과 CoreDNS에 `system-cluster-critical`이 붙어 있었다. 이름 때문에 CPU를 우대받을 것 같지만 아니다.

| 장치 | 작용 대상 |
|---|---|
| PriorityClass | 스케줄링 순서, 축출(preemption/eviction) 우선순위 |
| requests → `cpu.weight` | 런타임 CPU 시간 배분 |

**critical이라는 이름이 붙어도 CPU를 더 받지 않는다.** 이름에서 성질을 추론하면 틀린다.

### 지연 민감도는 역할이 아니라 요청 경로 위에 있는지로 판단한다

"실시간성이 중요한 컴포넌트인가"를 이름이나 인상으로 판단하면 갈린다. 그 클러스터에서:

- **ArgoCD** — reconciliation 루프. Git 폴링 → desired/actual 비교 → 동기화. 느려지면 동기화가 늦어질 뿐 사용자 경로에 없다. **BestEffort로 둬도 된다.**
- **Traefik** — ingress controller. TLS 종료 + 모든 인바운드 요청 프록시. Ingress 오브젝트를 확인하니 데모 두 개가 전부 `ingressClassName: traefik`으로 `api.hosugator.com`을 지난다. **모든 요청이 통과하는 지점이다.**

판단 기준은 "중요해 보이는가"가 아니라 **"요청 경로 위에 있는가"** 다.

### 프록시가 굶으면 추론 성공이 타임아웃으로 보인다

Traefik이 스케줄되지 못할 때 생기는 피드백 루프:

```
클릭 → Traefik → 추론 파드가 두 코어 점유
                    ↓
        Traefik이 weight 1로 밀림
                    ↓
    추론이 끝나도 응답을 프록시할 CPU를 못 받음
                    ↓
      클라이언트는 타임아웃 (추론은 성공했는데)
```

동시에 다른 방문자의 TLS 핸드셰이크도 지연된다. **무거운 작업 하나가 자기만 느려지는 게 아니라 API 표면 전체를 흔든다.** 요청 경로 위의 컴포넌트를 굶기면 실패가 국소화되지 않는다.

## Decision

**클러스터 컴포넌트를 하나로 묶지 않고, 요청 경로 위에 있는 것에만 requests를 부여한다.**

- Traefik: `requests.cpu: 100m` — BestEffort → Burstable로 클래스 이동
- ArgoCD: BestEffort 유지 — 자원 있을 때 수행되면 되는 성질
- 컨트롤 플레인: 손대지 않음 — 슬라이스 분리로 이미 보호됨

**이유**: 보호 비용을 전부에 균등하게 쓰면 정작 필요한 곳의 지분이 희석된다. 요청 경로가 판별 기준이다.

**전환 조건**: ArgoCD UI로 장애를 진단해야 하는 상황이 반복되면 `argocd-server`만 별도로 requests를 준다(가용성 문제는 아니고 운영 편의 문제).

## Related

- [[CPU contention is decided by requests weight not by limits]] — 가중치 메커니즘. 이 노트가 그 위에 슬라이스 축을 추가한다
- [[A CPU limit throttles in fixed periods so it inflates tail latency]] — 슬라이스 레벨은 `cpu.max = max`로 쿼터가 없었다
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — ingress가 앉는 서비스 계층
- [[Pod resource exhaustion is handled by kubelet and probes not by Service]] — 자원 고갈 처리 주체
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 컨트롤 플레인을 별도 축으로 다루는 다른 사례

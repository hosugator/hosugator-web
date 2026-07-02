---
created: 2026-06-11
updated: 2026-06-18
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - argocd
  - gitops
  - kubernetes
  - availability
publish: true
---
## Context
엣지 AI 아키텍처 설계 중 "Argo CD를 항상 켜두어야 하는가?"라는 질문이 나왔다. 현장 클러스터가 여러 곳이라면 중앙 Argo CD 서버 비용이 부담이 된다. k3s self-healing과 Argo CD의 역할 분리를 정확히 이해할 필요가 있었다.

## Insight
### Argo CD와 k3s/kubelet은 다른 레이어에서 동작한다

```
Argo CD         : Git → 클러스터 desired state 동기화 (배포 시점 담당)
k3s / kubelet   : 클러스터 내 pod·컨테이너 상태 자동 복구 (런타임 상시 담당)
```

Argo CD가 한 번 Git 상태를 클러스터에 적용하면, 이후 pod가 크래시하거나 OOM이 발생해도 k3s가 독립적으로 재시작한다. Argo CD가 꺼져있어도 self-healing은 계속된다.

### Argo CD는 "새 배포가 발생할 때" 켜져 있으면 충분하다

| 상황 | Argo CD 필요 여부 |
|---|---|
| 코드 변경 → 새 이미지 → 클러스터 롤링 업데이트 | 필요 (Git diff → apply) |
| pod 크래시 → 자동 재시작 | 불필요 (k3s kubelet이 처리) |
| 노드 재부팅 → pod 재스케줄 | 불필요 (k3s가 처리) |
| 스케일 아웃 | 불필요 (HPA가 처리) |

상시 운영이 필요한 것은 k3s/kubelet이고, Argo CD는 배포 이벤트 윈도우에만 필요하다.

### 표준 멀티클러스터는 에이전트 소프트웨어 없이 중앙에서 원격 k8s API를 직접 호출한다

Argo CD는 k8s와 별개 계층이다. `kubectl`이 자동화된 버전으로 이해하면 된다. 원격 클러스터의 API URL + 자격증명만 있으면 어디든 관리할 수 있다.

```bash
argocd cluster add site-a  # https://192.168.1.10:6443 + kubeconfig 등록
argocd cluster add site-b  # https://192.168.1.20:6443 + kubeconfig 등록
```

각 현장 게이트웨이 PC에는 k3s만 있으면 된다. Argo CD 소프트웨어는 중앙 서버에만 존재한다.

```
중앙 Argo CD (온디맨드 VM)
  ├── GitHub manifest 감시
  ├── 현장 A k3s API (6443) 직접 호출 → apply
  └── 현장 B k3s API (6443) 직접 호출 → apply

현장 게이트웨이 PC
  └── k3s만 실행 (Argo CD 없음)
```

**전제 조건**: 중앙 서버 → 각 현장 k3s API 포트(6443)가 네트워크상 열려있어야 한다. 공장 방화벽이 막혀있으면 VPN 터널이 필요하다.

## Related
- [[Argo CD self-healing silently restarts Jobs in monitored directories]] — self-healing의 의도치 않은 작동 사례
- [[Argo CD watches Git manifest and CI must update manifest to trigger deployment]] — Argo CD 기본 동작 원리
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — 이 구조가 적용되는 엣지 배포 토폴로지

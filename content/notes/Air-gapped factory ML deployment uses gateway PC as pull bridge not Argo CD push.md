---
created: 2026-06-10
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - edge
  - mlops
  - ci-cd
  - harbor
  - air-gap
  - factory
publish: true
---
## Context
align-ai를 사무실-공장 구조로 배포하는 방법을 설계하던 중, 공장 클러스터가 인터넷 직접 연결 없이 GHCR 이미지를 받는 방법과 Argo CD의 polling 방향을 이해해야 했다.

## Insight
### Argo CD는 pull 모델이다
Argo CD는 Git 레포를 주기적으로 polling하며, 클러스터 내부에서 외부 Git 서버(GitHub/GitLab)로 아웃바운드 연결만 필요하다. 사무실에서 공장 클러스터로 push 연결이 없어도 된다. "공장 클러스터 → GitHub" 방향의 outbound 443만 열리면 동작한다.

### 이미지 배포 토폴로지 (네트워크 격리 공장)

```
사무실 개발 PC
  └─ push → GitHub(코드) + GHCR(이미지)
                      ↓ pull (outbound only)
공장 게이트웨이 PC (인터넷 연결 1대)
  ├─ Argo CD agent or k3s control plane
  ├─ GHCR에서 이미지 pull → 내부 Harbor에 push
  └─ 내부 network
       └─ 공장 노드들 → Harbor에서 pull
```

게이트웨이 PC가 내부 Harbor 역할을 겸하거나, 별도 Harbor 노드를 둔다. 핵심: 공장 노드들은 **인터넷 불필요**, Harbor(사내 IP)에서만 pull.

### 완전 격리 환경 (인터넷 0대)
USB 이동식 디스크로 이미지 파일(`docker save` → `.tar`)을 물리 전달 후, 내부 Harbor에 push. Argo CD는 내부 GitLab을 polling.

### Harbor
CNCF 오픈소스 프라이빗 컨테이너 레지스트리. GHCR/Docker Hub의 셀프호스티드 대체재. 이미지 스캔, RBAC, replication 기능 포함.

## Decision
현재 개발 단계에서는 GHCR + k3s ctr import 방식으로 진행한다. 실제 공장 납품 시 Harbor + 내부 GitLab으로 전환한다. 전환 트리거: 공장 인터넷 연결 없음 or 네트워크 격리 요건 발생.

## Related
- [[Edge deployment separates control plane connectivity from worker node internet access]]
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]]
- [[k3s NVIDIA device plugin requires nvml strategy and runtimeClassName for GPU access]]

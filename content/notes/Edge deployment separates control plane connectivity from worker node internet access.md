---
created: 2026-06-09
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - edge
  - deployment
  - k3s
publish: true
---
## Context
align-ai Phase 5 준비 중 현장 배포 구조를 논의했다. 현장 설비의 인터넷 접근이 제한적인 경우 어떻게 CI/CD 파이프라인을 연결하는지 고민했다.

## Insight
### Worker Node는 인터넷이 필요 없고 Control Plane만 연결되면 된다

```
인터넷
  ↕
Control Plane (현장 내부망 or 클라우드)
  ↕ 내부망
Worker Node (현장 설비) — 인터넷 불필요
```

Worker Node는 Control Plane과만 통신한다. 이미지 pull도 내부 레지스트리(Harbor 등)를 두면 외부 인터넷 없이 가능하다.

### 현장 Control Plane이 인터넷에 연결되어야 하는 이유는 이미지 pull이다

Control Plane(게이트웨이 PC)은 GHCR에서 이미지를 pull해 내부 Harbor에 미러링하기 위해 인터넷이 필요하다. Worker Node는 내부 Harbor에서만 pull하므로 인터넷이 불필요하다.
Argo CD는 중앙 개발 서버에서 운영하므로, Control Plane이 Argo CD를 위해 인터넷에 연결할 필요는 없다. Argo CD의 위치에 따라 인터넷 필요 이유가 달라진다는 점에 주의한다.

### 사무실 개발 → 현장 자동 배포 흐름

```
개발자 git push (사무실)
  → GitHub Actions CI
  → manifest 업데이트
  → 중앙 Argo CD (개발 서버)
      Tailscale 경유 → 현장 A k3s API (6443) 직접 호출
      Tailscale 경유 → 현장 B k3s API (6443) 직접 호출
  → 각 Worker Node에 자동 배포
```

Argo CD는 각 현장 클러스터의 kubeconfig를 등록해 외부에서 관리한다. 현장 게이트웨이 PC에는 k3s만 있으면 된다. 장애 디버깅·초기 설정·Secret 등록 시에만 Tailscale SSH로 원격 접속한다.

## Related
- [[k8s core components each have a single responsibility across control and data planes]] — Control Plane과 Worker Node 역할 분리
- [[Kubernetes Service types layer on top of each other from ClusterIP to LoadBalancer]] — Worker Node 네트워크 구조
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — 중앙 Argo CD가 다수 현장 클러스터를 kubeconfig로 외부 관리하는 멀티클러스터 패턴
- [[Docker Compose before k8s because scale motivation must precede orchestration learning]] — 학습 계획
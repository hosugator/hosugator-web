---
created: 2026-06-09
updated: 2026-06-09
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - wsl2
  - kubernetes
  - k3s
  - networking
  - flannel
publish: true
---
## Context
align-ai Phase 5에서 테스트실 PC WSL2를 k3s Worker Node로 연결했다. 노드 등록은 성공했지만 실제 pod 간 통신이 실패했다.

## Insight
### 노드 등록과 pod 네트워크는 별개다

```
노드 등록 (성공)
  WSL2 → Control Plane TCP 6443 (outbound, WSL2에서 나가는 방향)

pod 네트워크 Flannel VxLAN (실패)
  Control Plane → WSL2 UDP 8472 (inbound, WSL2로 들어오는 방향)
```

WSL2가 NAT 뒤에 있어서 Control Plane에서 WSL2 내부 IP(`172.x.x.x`)로 직접 접근이 불가하다.

### netsh portproxy는 TCP 전용이라 UDP 포워딩 불가

Flannel VxLAN은 UDP 8472를 사용한다. Windows의 `netsh interface portproxy`는 TCP만 지원하므로 이 포트를 WSL2로 포워딩할 수 없다. 구조적 한계다.

### 증상

```
argocd-server (Worker Node)
  → DNS 쿼리 → CoreDNS (Control Plane)
  → i/o timeout
  → 모든 서비스 간 통신 불가
```

## Log
-  20260609 WSL2 Worker Node를 포기하고 Control Plane 단일 노드로 운영.  필요 시 WSL2 브릿지 네트워크 모드 (`networkingMode=bridged` in `.wslconfig`) 고려.

## Related
- [[k3d wraps k3s nodes in Docker containers enabling disposable local clusters]] — k3d는 이 문제가 없음 (Docker 내부 네트워크)
- [[Edge deployment separates control plane connectivity from worker node internet access]] — 실제 현장에서는 Linux 머신이라 이 문제 없음

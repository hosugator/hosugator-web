---
created: 2026-06-28
updated: 2026-06-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - rancher-desktop
  - orbstack
  - macos
  - k3s
  - lima
publish: true
---
## Context
k3s 멀티노드 테스트를 위해 맥북에 Linux VM이 필요했다. macOS는 Darwin 커널 기반이라 cgroups, namespaces 등 Linux 커널 기능이 없어 k3s를 직접 실행할 수 없다. OrbStack과 Rancher Desktop 중 하나를 골라야 했다.

## Insight
### macOS에서 k3s를 실행하려면 Linux VM이 필수다

Docker Desktop도 내부적으로 숨겨진 Linux VM을 사용한다. 차이는 그 VM에 직접 접근 가능한지 여부다.

```
Docker Desktop  → Linux VM (잠김, Docker만 실행 가능)
OrbStack        → Linux VM (열림, 임의 프로세스 실행 가능)
Rancher Desktop → Lima VM (열림, rdctl shell로 접근)
```

`rdctl shell`로 Lima VM에 접속해 k3s agent를 직접 실행할 수 있다.

### Rancher Desktop과 OrbStack의 실질적 차이

| | Rancher Desktop | OrbStack |
|---|---|---|
| 라이선스 | Apache 2.0 (상업적 무제한) | 개인 무료, 상업 유료 |
| Docker 호환 | dockerd 선택 시 동일 | 기본 동일 |
| VM 접근 | rdctl shell | orb shell |
| UI | Electron (크로스플랫폼) | macOS 네이티브 |

## Decision
**OrbStack 대신 Rancher Desktop 선택**

이유: Apache 2.0 라이선스라 앱 개발로 수익을 창출하는 상황에서도 라이선스 문제가 없다. OrbStack은 상업적 사용 시 유료 전환이 필요하다.

```bash
brew install --cask rancher
# 초기 설정: Container Engine → dockerd, Enable Kubernetes → OFF
/Applications/Rancher\ Desktop.app/Contents/Resources/resources/darwin/bin/rdctl shell
# rdctl이 PATH에 없으므로 전체 경로 사용 또는 PATH 추가 필요
```

**전환 조건**: 개발 흐름을 막을 정도로 불편해지거나 팀 규모에서 OrbStack 유료 비용이 정당화되면 재검토.

## Consequences
- k3s agent join 성공: Lima VM이 회사 PC k3s 클러스터의 worker node로 등록됨
- docker build, docker push 등 기존 명령어 변경 없음 (dockerd 선택 시)
- Windows 팀원은 WSL2에서 동일한 방식으로 k3s agent 실행 가능

## Related
- [[Docker requires Linux kernel so WSL2 acts as the kernel provider on Windows]] — 같은 원리, Windows 맥락
- [[WSL2 Worker Node fails on cross-node pod networking due to NAT and TCP-only port proxy]] — Windows WSL2 worker node의 구조적 한계

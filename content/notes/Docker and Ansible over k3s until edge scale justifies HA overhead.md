---
created: 2026-05-11
updated: 2026-05-11
status: 3-superseded
type: insight
subject: "[[Infra]]"
project: "[[Edge AI LMR]]"
tags:
  - edge-ai
  - docker
  - k3s
  - kubernetes
  - deployment
  - adr
publish: true
---
> superseded by [[Industrial edge deployments split Windows hardware integration from Linux inference servers]]
## Context
LMR AOI 시스템의 배포 구조는 **설비 PC 여러 대 → Edge PC 1대**로 집중되는 형태다.
Edge PC가 추론 서버 역할을 하므로, Edge PC 장애 시 연결된 모든 설비의 추론이 동시에 멈추는 단일 장애점이 된다.
배포 및 가용성 확보를 위해 Docker + Ansible과 k3s 중 선택이 필요했다.

## Decision
**초기 현장 투입: Docker + Ansible (Edge PC 2대, active/standby)**

k3s는 현재 규모에서 오버엔지니어링으로 판단.

| | Docker + Ansible | k3s |
|--|--|--|
| Edge PC 장애 시 | 수동 개입 필요 | 자동 failover |
| 무중단 배포 | 재시작 시 잠깐 중단 | rolling update 가능 |
| 구축/운영 난이도 | 낮음 | 높음 (etcd, control plane 관리) |
| HA 최소 구성 | 2대 | control plane 3대 + worker |

k3s HA는 Raft 합의 알고리즘 특성상 control plane 최소 3대가 필요하다.
현재 설비 규모에서는 그 운영 비용이 이점보다 크다.

이미지 배포는 사내 네트워크 기반 Private Registry 또는 `docker save/load` 방식으로 인터넷 단절 환경에 대응한다.

## Consequences
- Edge PC 장애 시 수동 개입 필요 (active/standby 전환)
- 추론 서버 재시작 시 잠깐 중단 감수
- **k3s 전환 검토 시점**: 설비 수 대규모 증가 또는 무중단 요구사항이 생기는 시점

## Verification
- 2026-06-09: align-ai k3s 실습에서 직접 확인. 노드 1-2대 환경에서 k8s HA/Self-healing은 "pod 재시작" 정도만 유효. 노드 자체가 죽으면 서비스 중단 — HA 의미 없음. Docker + Watchtower 대비 k3s의 실질적 우위가 CI/CD 자동 배포 외에는 희박함을 재확인.

## Related
- [[Different role among Vite React FastAPI Node.js in web application]] — FastAPI 서버 구조
- [[How to inference with sole object independent with language]] — ONNX Runtime 기반 추론 엔진
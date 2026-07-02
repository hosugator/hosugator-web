---
created: 2026-06-11
updated: 2026-06-23
type: insight
status: 2-stable
subject: "[[OS]]"
project: "[[Align AI]]"
tags:
  - wsl2
  - docker
  - windows
  - edge-ai
  - gpu
publish: true
---
## Context
엣지 AI 아키텍처 논의 중 게이트웨이 PC가 Linux 네이티브여야 하는 이유를 점검했다. k3s를 걷어내기로 하면 Linux 필요 이유 하나가 사라지고, WSL2 GPU 학습이 가능하다면 Windows 게이트웨이 PC도 선택지가 된다. Docker가 Linux 기반이기에 WSL2를 내부적으로 사용한다.

## Insight
### k3s 제거 시 Linux 필요 이유가 하나씩 사라진다

| Linux 필요 이유 | k3s 제거 후 |
|---|---|
| k3s Linux 커널 의존 | **사라짐** |
| GPU Docker 학습 (nvidia-container-toolkit) | 유지 — 단, WSL2에서도 동작 가능 |
| Docker 네이티브 실행 (WSL2 오버헤드 없음) | 유지 — 단, 허용 가능 수준인지 검증 필요 |
| hostPath 경로 일관성 | 유지 |

k3s만 없애도 GPU 학습 안정성이 주요 이유로 남는다. 그러나 WSL2 GPU 지원이 2021년 이후 안정화됐으므로 검증이 필요할 뿐 구조적 불가는 아니다.

### WSL2 GPU 접근은 Windows 드라이버 하나로 연결된다

```
Windows
  └── NVIDIA 드라이버 (Windows에만 설치)
        └── WSL2 (자동으로 GPU 접근 가능)
              └── Docker
                    └── align-ai-train 컨테이너 (--gpus all)
```

WSL2 안에 별도 CUDA 드라이버를 설치할 필요 없다. Windows 드라이버가 `/dev/dxg`를 통해 WSL2까지 연결된다.
공장 현장에 Windows PC가 이미 있다면 Linux PC를 새로 구매하지 않아도 된다. 도입 비용·저항이 낮아지는 실질적인 이점이다.

## Related
- [[Industrial edge deployments split Windows hardware integration from Linux inference servers]] — Windows 현장 환경의 역사적 맥락
- [[WSL2 Worker Node fails on cross-node pod networking due to NAT and TCP-only port proxy]] — WSL2를 k8s Worker Node로 쓸 때의 한계 (이 노트와 다른 맥락 — 여기선 학습용 Docker 실행만 필요)
- [[Argo CD is a deployment coordinator not a runtime dependency, k3s self-heals without it]] — k3s 제거 결정 맥락
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — Windows에서도 동일하게 적용되는 이미지 구조
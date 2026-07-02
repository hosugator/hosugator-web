---
created: 2026-06-09
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - edge-ai
  - deployment
  - windows
  - linux
  - sdk
publish: true
---
## Context
align-ai k3s 실습 후 팀원과 현장 배포 구조를 논의했다. 왜 현장은 Windows인데 서버는 Linux인지, 그리고 실제 현장 배포 구조가 어떻게 되는지 정리했다.

## Insight
### 두 생태계가 역사적으로 다른 커뮤니티에서 성장했다

```
서버/ML    → 개발자/연구자 커뮤니티 → Linux (오픈소스, 무료, Docker/k8s 네이티브)
산업 현장  → 제조업/자동화 업계    → Windows (PLC, SCADA, 카메라 SDK 레거시)
```

ML이 현장으로 들어오면서 두 생태계가 충돌한다. WSL2, Docker Desktop이 발전하는 이유다.

### 설비 PC는 Worker Node가 아니라 클라이언트다

```
설비 PC (Windows)          추론 서버 (Linux, k3s)
  카메라 SDK 연동    →HTTP→  inference pod 실행
  이미지 캡처               결과 반환
  기존 팀 방식 유지
```

설비 PC가 Worker Node가 되는 게 아니라, 설비 PC는 클라이언트, Linux 서버가 Worker Node다.
카메라 SDK가 Linux를 지원하면 통합형(한 대에서 처리)도 가능하다. SDK 지원 여부가 구조를 결정한다.

## Related
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]] — 소규모 현장에서 Docker 우선 결정
- [[Edge deployment separates control plane connectivity from worker node internet access]] — Control Plane 인터넷 연결 구조
- [[WSL2 Worker Node fails on cross-node pod networking due to NAT and TCP-only port proxy]] — Windows 현장에서 WSL2 한계
- [[Node-level HA and pod-level self-healing address different failure layers]] — self-healing은 단일 노드에서도 유효하다는 분리 논의
- [[Kubernetes replicas are active-active concurrent pods not standby]] — replica semantics 및 Service vs 스케줄러 역할 분리

---
created: 2026-07-02
updated: 2026-07-02
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - factory
  - edge
  - ci-cd
  - networking
  - air-gap
publish: true
---
## Context
Align AI 현장 배포 설계 중, 고객사 현장이 "인터넷 연결 PC는 있지만 설비 PC는 폐쇄망"인 조건으로 주어졌다. 선임들이 설비 PC 업데이트를 위해 USB를 들고 출장을 자주 갔다는 경험담을 들었는데, 인프라 지식(Tailscale로 맥북 ↔ 회사 PC 연결 경험)을 바탕으로 이것이 기술적 필연인지 따졌다.

## Insight
### 폐쇄망의 목적은 인터넷 차단이지 내부망 차단이 아니다

| 구조 | 의미 | 게이트웨이 CI/CD 가능? |
|---|---|---|
| 인터넷으로부터 설비 PC 격리 | 외부 접근 차단, 내부망 허용 | 가능 |
| 모든 네트워크로부터 완전 격리 | 물리적 단절 | 불가 |

공장 설비망 폐쇄는 거의 대부분 전자다. 설비 유지보수를 위해 내부 관리 PC의 접근은 반드시 필요하므로, 완전 격리를 하면 운영 자체가 불가능하다. 완전 에어갭은 방산·원전처럼 극도의 보안이 요구되는 예외적 환경에 국한된다.

### 듀얼 NIC 게이트웨이 PC가 두 망의 접점이 된다

```
[인터넷]
    |
[사무실 네트워크 192.168.1.x]
    |
[게이트웨이 PC]  ← eth0: 사무실망 / eth1: 설비망
    |
[설비 네트워크 10.0.0.x]
    ├── 설비 PC A
    └── 설비 PC B
```

게이트웨이 PC에 Tailscale을 설치하면 원격에서 설비망으로 터널링이 가능하다. Argo CD가 Tailscale 경유로 설비망 k3s API(6443)에 직접 배포하는 구조가 된다.

### USB 출장 반복은 기술적 제약이 아니라 인프라 부재의 신호다

선임들의 USB 출장 경험은 게이트웨이 역할을 하는 기계가 없었거나, 있어도 설정한 사람이 없었던 것이다. 폐쇄망이라서 불가능한 게 아니라, 연결을 만들 사람이 없었던 것이다.

### 현장 투입 전 검증해야 할 단 하나의 질문

> "인터넷 PC와 설비 PC 양쪽 네트워크에 NIC이 있는 기계가 존재하는가?"

- **있다** → CI/CD 구축 가능, USB 출장 제거 가능
- **없다** → 게이트웨이 PC 신규 설치가 선행 작업 (이것 자체가 USB 반입이 필요한 첫 출장)

### 기술적 가능성과 접근권 허가는 별개의 문제다

게이트웨이 PC가 존재하더라도, 고객사가 외부 벤더에게 해당 기계의 접근권을 줄지는 다른 차원의 결정이다. 실질적 제약은 네트워크 토폴로지가 아니라 **고객사의 보안 정책과 신뢰 수준**이다.

| 접근권 부여 여부 | 결과 |
|---|---|
| SSH / Tailscale 설치 허용 | 원격 CI/CD 완전 자동화 |
| 게이트웨이 내부에서 스크립트만 실행 허용 | 제한적 자동화 (push 불가, pull trigger만) |
| 접근권 없음 | USB 출장 유지, 단 게이트웨이가 있으면 내부에서 pull은 가능 |

따라서 "USB 출장을 없앨 수 있는가"는 기술 질문이 아니라 **협상 질문**이다.

## Related
- [[Air-gapped factory ML deployment uses gateway PC as pull bridge not Argo CD push]] — 게이트웨이 PC를 통한 이미지/모델 배포 전체 구조
- [[Edge deployment separates control plane connectivity from worker node internet access]] — Tailscale을 통한 Control Plane 원격 접근 및 Argo CD 멀티클러스터 패턴
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — 게이트웨이를 통해 배포되는 이미지의 내용

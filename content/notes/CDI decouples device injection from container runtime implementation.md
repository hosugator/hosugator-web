---
created: 2026-06-10
updated: 2026-06-10
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - kubernetes
  - nvidia
  - gpu
  - containerd
publish: true
---
## Context
k3s에서 NVIDIA device plugin v0.17.x를 설치했을 때 `Incompatible strategy detected auto` 오류가 발생. 
device plugin이 GPU를 발견하려면 컨테이너 런타임이 nvidia 장치를 어떻게 주입하는지 알아야 하는데, `auto` 전략이 CDI 설정 여부를 먼저 확인하다 실패했다.

## Insight
### CDI 스펙 생성
CDI(Container Device Interface)는 GPU 같은 하드웨어 장치를 컨테이너에 주입하는 **표준 인터페이스 규격**이다.
컨테이너 런타임(containerd, crun 등)은 GPU 제조사를 모르기 때문에 CDI가 "이 장치를 컨테이너에 붙이려면 어떤 디바이스 파일, 마운트, 환경변수가 필요한지"를 YAML 스펙으로 정의한다.

```bash
sudo mkdir -p /etc/cdi /var/run/cdi
sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml
nvidia-ctk cdi list  # 검증
```

### nvidia-device-plugin v0.17.x의 auto 전략 실패 원인
`auto` 전략은 CDI 또는 NVML 중 하나가 제대로 설정돼야 동작한다. CDI 스펙이 없으면 NVML 경로도 막혀 있으면 `Incompatible strategy detected auto`로 중단한다.
- 해결책: ConfigMap으로 `deviceDiscoveryStrategy: nvml`을 명시한다.

### CDI는 컨테이너 생태계의 표준 인터페이스 패턴 중 하나다
CDI를 이해하다 보면 더 넓은 패턴을 마주하게 된다. 컨테이너 생태계 전반에 "두 계층 사이에 표준 인터페이스를 두어 결합을 끊는다"는 설계 철학이 반복된다.

```
CRI  ─ k8s(kubelet) ↔ 컨테이너 런타임        [k8s 전용]
CNI  ─ 런타임 ↔ 네트워크 플러그인             [k8s 전용]
CSI  ─ 런타임 ↔ 스토리지 플러그인             [k8s 전용]
OCI  ─ 런타임 ↔ 이미지 형식·실행 규격         [업계 표준]
CDI  ─ 런타임 ↔ GPU 등 장치 주입              [업계 표준]
```

k8s가 CDI를 채택한 것이 아니라, CDI가 결합 문제를 잘 풀기 때문에 k8s를 포함한 여러 시스템이 채택한다. 표준 인터페이스 자체가 채택 이유다.
이 패턴은 소프트웨어 전반에 반복된다 — USB(하드웨어 ↔ OS), Git SSOT(개발자 ↔ 인프라/배포), CDI(런타임 ↔ 제조사). 스케일만 다를 뿐 문제와 해법이 같다.

## Related
- [[PyTorch wheel bundles CUDA runtime making python slim base sufficient for GPU training containers]]
- [[IaC GitOps and DaC share the same Git SSOT pattern applied to different operational domains]] — 같은 "표준 인터페이스로 결합을 끊는" 패턴의 상위 개념

---
created: 2026-06-10
updated: 2026-06-10
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - k3s
  - nvidia
  - gpu
  - device-plugin
  - cuda
publish: true
---
## Context
align-ai 프로젝트에서 k3s + NVIDIA device plugin v0.17.0 조합으로 GPU 학습 파이프라인을 구성. GPU 탐지 실패, NVML 라이브러리 없음, kubelet socket 경로 오류까지 3개의 독립적인 오류가 연속으로 발생했다.

## Insight
k3s에서 NVIDIA GPU를 Pod에 정상 노출하려면 **4가지 설정이 모두 맞아야** 한다.

### 1. ConfigMap으로 `deviceDiscoveryStrategy: nvml` 명시
device plugin v0.17.x의 `auto` 전략은 CDI 스펙 없이는 실패한다. ConfigMap으로 명시적으로 nvml을 선언한다.
```yaml
deviceDiscoveryStrategy: nvml
nvidiaDriverRoot: /usr/local/nvidia
```

### 2. device plugin Pod에 `runtimeClassName: nvidia`
NVML 초기화 시 `libnvidia-ml.so`가 필요하다. 이 라이브러리는 컨테이너 이미지에 없고 호스트에만 있다. `runtimeClassName: nvidia`로 실행하면 nvidia-container-runtime이 호스트 NVIDIA 드라이버 라이브러리를 컨테이너에 자동 마운트한다.

### 3. 학습 Pod에도 `runtimeClassName: nvidia`
device plugin이 GPU 리소스를 할당해도, `torch.cuda.is_available()` 사용 시 CUDA 라이브러리가 없으면 False를 반환한다. 학습 Pod에도 동일하게 `runtimeClassName: nvidia`가 필요하다.

### 4. hostPath는 `/var/lib/kubelet/device-plugins`
k3s는 표준 kubelet 소켓 경로를 사용한다. `/var/lib/rancher/k3s/agent/kubelet/device-plugins`가 아니다.
디버그 방법: `hostPath: /` 마운트 debug Pod로 실제 경로 확인.

## Decision
CDI 스펙 생성(`nvidia-ctk cdi generate`) 대신 `deviceDiscoveryStrategy: nvml`을 선택했다. CDI 설정은 호스트 시스템 상태에 따라 다시 생성해야 하는 반면, nvml은 드라이버가 설치된 k3s 노드에서 항상 동작한다. NVIDIA 공식 컨테이너 툴킷이 없는 환경으로 전환 시 CDI를 재검토한다.

## Related
- [[CDI decouples device injection from container runtime implementation]]
- [[k8s container shm is 64MB by default and must be sized separately from memory limits]]
- [[Docker and Ansible over k3s until edge scale justifies HA overhead]]

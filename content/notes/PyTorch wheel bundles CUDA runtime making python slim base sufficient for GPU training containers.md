---
created: 2026-06-02
updated: 2026-07-31
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Align AI]]"
tags:
  - docker
  - pytorch
  - cuda
  - deployment
publish: true
---
## Context
align-ai Docker Compose 실습에서 `Dockerfile.train`의 베이스 이미지를 `python:3.12-slim`으로 쓰는 게 맞는지 우려했다.
CUDA 지원을 위해 `nvidia/cuda` 베이스 이미지가 필요하다고 가정했고, 버전 정합성 문제를 예상했다. 실제로는 `python:3.12-slim` + `torch==2.11.0` (CPU 의도)로 빌드했는데 GPU 100% 학습이 성공했다.

## Insight
### torch를 설치하면 CUDA 런타임이 함께 따라오므로 베이스 이미지에 CUDA가 없어도 된다
`pip install torch==2.11.0`을 Linux x86_64에서 실행하면 CUDA 빌드가 자동 선택되고, **CUDA 라이브러리가 site-packages 안으로 들어온다.** 베이스 이미지에 CUDA가 없어도 GPU를 쓸 수 있는 이유가 이것이다.

```
nvidia/cuda 베이스 이미지:  OS + CUDA 라이브러리
python:3.12-slim + torch:  OS + (site-packages 안에 CUDA 라이브러리)
→ 결과적으로 동일한 GPU 접근성
```

> **2026-07-31 정정 — "wheel 안에 번들"은 리눅스에서 사실이 아니다.**
> 리눅스 torch wheel은 782MB이고, CUDA 라이브러리는 **`nvidia-*` 별도 pip 패키지 15개**(cuDNN 627MB, cuBLAS 567MB 등, 합계 약 3.5GB)로 의존성에 딸려 온다. wheel 안에 들어 있는 것은 **윈도우 쪽**이다 — win_amd64 wheel이 2.60GB이고 `nvidia-*`를 하나도 설치하지 않는다.
>
> 위 결론(슬림 베이스로 충분)은 그대로 유효하다. pip이 의존성을 함께 설치하기 때문이다. 다만 **메커니즘이 "자기완결"이 아니라 "의존성 동반"이라는 차이가 실무에서 드러난다** — 같은 환경의 다른 패키지(`onnxruntime-gpu`)가 그 `nvidia-*`를 빌려 쓰게 되고, 리눅스에서는 디렉터리가 흩어져 있어 `dlopen`이 못 찾는 문제가 생긴다. 자세한 층 구조는 [[GPU stacks support different hardware at each layer so one layer's verdict does not speak for another]].

### 베이스 이미지의 역할은 CUDA 제공이 아니라 OS 환경 제공이다
`nvidia/cuda` 베이스가 필요한 경우는 torch 없이 직접 CUDA C/C++ 코드를 컴파일하거나 cuDNN을 별도로 제어할 때다.
PyTorch 학습 환경에서는 torch 설치가 필요한 CUDA 의존성을 함께 끌고 오므로 `python:slim`으로 충분하다.

### 자기완결과 의존성 동반은 결과가 같아 보여도 다르다
- `.onnx`: 계산 그래프 + 가중치를 하나의 파일에 — **진짜 자기완결**. 파일 하나만 옮기면 된다
- `torch`(리눅스): CUDA 런타임이 `nvidia-*` 패키지로 **함께 설치됨** — 컨테이너 안에서는 같은 효과지만, 같은 환경의 다른 패키지가 그것을 빌려 쓸 수 있고 경로 문제도 생긴다
- `torch`(윈도우): CUDA DLL이 wheel 안에 — 이쪽이 자기완결이다

**컨테이너 관점에서는 구분이 필요 없었지만, 한 환경에 GPU 패키지가 둘 이상 들어오면 구분이 드러난다.**

## Verification
- 20260731: GV-001에서 리눅스 torch 2.11.0+cu128 설치 시 `nvidia-*` 15개가 별도 설치됨을 확인 (`uv pip list`), CI 다운로드 내역에서 리눅스 4.33GiB(32패키지) vs 윈도우 3.17GiB(18패키지, `nvidia-*` 0개) 대조. 위 정정 참조.
- 20260602: align-ai `Dockerfile.train` (`python:3.12-slim` 베이스) + nvidia-container-toolkit으로 `docker compose run train` 실행 → `device: cuda`, GPU utilization 100% 확인.

## Related
- [[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — 같은 자기완결 패키징 원리
- [[ML 개발 환경 전략 - venv vs conda vs Docker]] — ML 환경 선택 맥락
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 컨테이너화 개념 맥락
- [[GPU stacks support different hardware at each layer so one layer's verdict does not speak for another]] — 이 노트의 메커니즘을 정정하고 층 구조로 확장한 노트

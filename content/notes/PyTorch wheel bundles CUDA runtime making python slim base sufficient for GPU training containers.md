---
created: 2026-06-02
updated: 2026-06-02
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
### PyPI의 torch wheel은 CUDA 런타임을 내부에 번들한다
`pip install torch==2.11.0`을 Linux x86_64에서 실행하면 PyPI가 CUDA 번들 wheel(`2.11.0+cu130`)을 자동 선택한다. 이 wheel 안에 CUDA 라이브러리가 포함되어 있어서 베이스 이미지에 CUDA가 없어도 GPU를 사용할 수 있다.

```
nvidia/cuda 베이스 이미지:  OS + CUDA 라이브러리
python:3.12-slim + torch:  OS + (torch wheel 안에 CUDA 라이브러리 포함)
→ 결과적으로 동일한 GPU 접근성
```

### 베이스 이미지의 역할은 CUDA 제공이 아니라 OS 환경 제공이다
`nvidia/cuda` 베이스가 필요한 경우는 torch 없이 직접 CUDA C/C++ 코드를 컴파일하거나 cuDNN을 별도로 제어할 때다.
PyTorch 학습 환경에서는 torch wheel이 필요한 CUDA 의존성을 자기 안에 담고 있으므로 `python:slim`으로 충분하다.

### 이는 ONNX의 자기완결성과 같은 원리다
- `.onnx`: 계산 그래프 + 가중치를 하나의 파일에 — Python 코드 불필요
- `torch wheel`: CUDA 런타임을 wheel 안에 — CUDA 베이스 이미지 불필요

## Verification
- 20260602: align-ai `Dockerfile.train` (`python:3.12-slim` 베이스) + nvidia-container-toolkit으로 `docker compose run train` 실행 → `device: cuda`, GPU utilization 100% 확인.

## Related
- [[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — 같은 자기완결 패키징 원리
- [[ML 개발 환경 전략 - venv vs conda vs Docker]] — ML 환경 선택 맥락
- [[Containerization orchestration and CI-CD address packaging runtime and delivery as separate concerns]] — 컨테이너화 개념 맥락

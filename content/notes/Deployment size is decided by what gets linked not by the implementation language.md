---
created: 2026-07-27
updated: 2026-08-03
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - deployment
  - packaging
  - onnx
  - edge-ai
publish: true
---
## Context
MLA 검사기의 PyInstaller 배포물이 수 GB가 되는 문제를 논의했다. "파이썬이라서 무겁다, C++로 쓰면 극단적으로 줄어든다"는 직관을 검증하려고 실제 venv를 측정했다.

## Insight
### 파이썬 코드는 배포 용량의 2%다 — 언어가 원인이 아니다

```
전체                7.1 GB
├─ 네이티브 .so     6.4 GB   (90%)
└─ 파이썬 .py       133 MB   (2%)
```

```
nvidia/     3.6G   cuDNN 1.0G, cuBLAS 573M, cuSPARSELt 432M, NCCL 377M
torch/      1.7G   libtorch_cuda.so 962M, libtorch_cpu.so 427M
triton/     688M
PySide6/    648M   (Qt 자체가 C++ 라이브러리)
```

무게의 정체는 이미 C/C++로 컴파일된 바이너리다. C++로 다시 써도 cuDNN·cuBLAS·libtorch를 링크하면 같은 용량이 된다. libtorch C++ 배포판도 CUDA 포함 시 2~3GB다. 인터프리터 제거는 ~100MB 절감으로, 7GB 앞에서 무의미하다.

### C++이 작아지는 건 언어 특성이 아니라 링크 통제권이다

| 레버 | 효과 | 파이썬 |
|---|---|---|
| GPU 아키텍처 선택 컴파일 | `libtorch_cuda.so` 962M → 6종 중 1종 | ❌ wheel은 전 아키텍처 포함 |
| 링커 데드코드 제거 | 라이브러리별 상이 | ❌ 동적 `import`라 원리적 불가 |
| wheel 중복 제거 | 수백 MB | ❌ 각 wheel이 자기완결적 |

파이썬에서 데드코드 제거가 불가능한 이유는 `import`가 런타임에 결정되기 때문이다. 그래서 PyInstaller는 필요한 걸 자동으로 찾는 게 아니라 불필요한 걸 사람이 손으로 빼는 방식이 된다 (`excludes=[...]`, `collect_submodules(...)`).

## Related
- [[Docker image contains only code and packages, runtime data mounts via hostPath volumes]] — 이미지와 데이터 분리 원칙
- [[C-based industrial SDK distributes binary not source for device simplicity and IP protection]] — 추론 전용 바이너리 배포의 선행 사례
- [[CUDA capability must be verified by executing a kernel not by querying availability]] — 아키텍처별 커널이 용량을 지배하는 배경
- [[Orchestrator autonomy conflicts with equipment control so equipment PCs stay clients]] — 분리된 Runtime을 무엇으로 배포할지

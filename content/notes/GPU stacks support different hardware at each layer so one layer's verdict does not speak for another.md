---
created: 2026-07-31
updated: 2026-07-31
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[GV-001 MLA Inspector]]"
tags:
  - gpu
  - cuda
  - dependency-management
  - packaging
publish: true
---
## Context
개발 리눅스(RTX 5070 Laptop)에서 **torch는 CUDA를 못 쓰는데 onnxruntime은 쓰는** 상황을 만났다. 같은 GPU, 같은 드라이버, 같은 가상환경인데 결과가 달랐다.

torch 휠을 올려 고치려다가, 최신(cu130)을 고르면 onnxruntime이 깨진다는 것을 알게 됐다. 그때까지 `cu126` 같은 꼬리표를 "버전 표시" 정도로만 보고 있었고, 층이 나뉘어 있다는 것을 몰랐다.

## Insight
### 스택은 다섯 층이고 층마다 "지원하는 하드웨어"가 따로 있다

```
4층  프레임워크        torch (학습) / onnxruntime (추론)
3층  CUDA 라이브러리   cuBLAS, cuDNN, cuFFT ...  = nvidia-* pip 패키지
2층  CUDA 런타임       12.6 / 12.8 / 13.0  →  cu126 / cu128 / cu130
1층  드라이버          OS 커널 ↔ GPU. OS 에 직접 설치하는 유일한 것
0층  하드웨어          sm_86 (RTX A4000) / sm_120 (RTX 5070)
```

**`sm_XX`는 GPU의 명령어 집합 세대**(compute capability)다. CPU에 x86과 ARM이 있어 실행 파일을 서로 못 쓰는 것과 같고, GPU 커널은 아키텍처별로 따로 컴파일된 기계어다.

```
sm_50/60/70   Maxwell·Pascal·Volta   GTX 900/1000, V100
sm_75/80/86   Turing·Ampere          RTX 20/30, A4000
sm_90         Hopper                 H100
sm_100/120    Blackwell              RTX 50
```

**휠(wheel)은 미리 컴파일한 배포물이라 아키텍처 목록이 굳어 있다.** 내 GPU의 `sm`이 목록에 없으면 설정 문제가 아니라 **실행할 코드 자체가 없는 것**이다.

```
torch 2.12.1+cu126   sm_50 sm_60 sm_70 sm_75 sm_80 sm_86 sm_90        sm_120 없음
torch 2.11.0+cu128   sm_75 sm_80 sm_86 sm_90 sm_100 sm_120
```

### 그래서 같은 GPU에서 층마다 답이 다를 수 있다

처음 만난 수수께끼가 이걸로 풀렸다.

```
torch          자체 커널을 수천 개 갖고 있다        →  sm_120 판이 없으면 못 돈다
onnxruntime    연산 상당수를 cuBLAS·cuDNN 에 맡긴다  →  그 라이브러리가 새 GPU 를 안다
```

**3층은 NVIDIA가 만들어 새 하드웨어를 먼저 지원하고, 4층은 각 프레임워크가 자기 커널을 따로 빌드한다.** 지원 범위가 층마다 다르니, 한 층의 판정이 다른 층을 대변하지 않는다.

### 층 사이의 계약은 soname이고, 이것이 선택을 묶는다

```
$ objdump -p libonnxruntime_providers_cuda.so | grep NEEDED
  libcublasLt.so.12   libcublas.so.12   libcudart.so.12   libcudnn.so.9
```

`.so`는 리눅스 공유 라이브러리(윈도우의 `.dll`)이고 뒤 숫자가 **soname** — 호환되는 메이저 버전이다. `.so.12`를 요구하는데 `.so.13`을 주면 파일이 있어도 못 찾는다.

여기서 숨은 결합이 드러난다. **`onnxruntime-gpu`는 CUDA 라이브러리를 번들하지 않고 torch가 끌고 오는 `nvidia-*` 패키지를 빌려 쓴다.** 선언된 의존이 아니라 **같은 환경에 있으니 쓰는** 관계다.

```
torch 를 cu130 으로 올린다  →  nvidia-*-cu13 (.so.13) 이 깔린다
                            →  ORT 가 .so.12 를 못 찾는다
                            →  예외 없이 CPU 로 폴백한다
```

`cu128`은 CUDA 12.8이라 soname이 그대로 `.12`다. 그래서 `sm_120`을 얻으면서 ORT를 깨지 않는 유일한 선택지였다.

| 빌드 | torch | 양 플랫폼 휠 | 아키텍처 | CUDA 12 |
|---|---|---|---|---|
| cu126 | 2.12.1 | O | sm_50~90 | O |
| **cu128** | 2.11.0 | O | sm_75~120 | **O** |
| cu130 / cu132 | 2.12.1 | O | sm_75~120 | X |

### 플랫폼마다 3층의 배포 형태가 다르고, 그것이 로딩 문제를 만든다

CI 로그의 다운로드 내역에서 드러났다.

```
리눅스   32개  4.33 GiB   torch 782MB + nvidia-* 15개 (cudnn 627, cublas 567 ...)
윈도우   18개  3.17 GiB   torch 2.60 GiB 단일 휠,  nvidia-* 0개
```

**윈도우 torch 휠은 CUDA DLL을 안에 품고, 리눅스는 별도 pip 패키지로 흩어진다.**

이것이 며칠 전 `ort.preload_dlls()`가 왜 필요했는지를 설명한다. 윈도우에서는 ORT가 `torch/lib/`의 DLL을 찾을 수 있지만, **리눅스에서는 `nvidia-*` 패키지마다 다른 디렉터리라 `LD_LIBRARY_PATH` 없이 `dlopen`이 못 찾는다.** 그리고 그 변수는 프로세스 시작 시 고정되므로 실행 중에 바꿔도 소용없다.

### 그래서 "GPU가 되는가"는 층마다 따로 물어야 한다

정리하면 확인할 것이 층마다 다르다.

```
0층  nvidia-smi 가 GPU 를 보는가
1층  드라이버가 CUDA 런타임 버전을 감당하는가
2·3층 설치된 nvidia-* 의 메이저가 프레임워크가 기대하는 soname 과 맞는가
4층  이 프레임워크 휠에 내 sm 이 들어있는가  ← 여기가 가장 자주 어긋난다
```

**한 번의 확인으로 끝내려 하면 반드시 틀린다.** 실제로 `has_gpu`(0층)가 `True`인데 4층이 실패하는 조합이 개발기의 상태였다.

## Related
- [[Verify a capability by exercising it because declarations describe the build not the machine]] — 층마다 다르다는 것이 왜 실행으로 판정해야 하는지의 구조적 이유
- [[Cross-platform reproducibility comes from locking resolution not from the manifest format]] — 층 선택을 lockfile 로 고정하는 방법
- [[A workaround becomes debt the moment the gap it covered closes]] — 이 스택 위에서 만들어졌던 우회로의 사례
- [[IT 시스템 구성 요소 (하드웨어, OS, 가상 환경)]] — 층으로 보는 같은 관점을 시스템 일반에
- [[PyTorch wheel bundles CUDA runtime making python slim base sufficient for GPU training containers]] — 3층이 pip 패키지로 딸려 오는 배경. 오늘 실측으로 그 노트의 메커니즘 설명을 정정했다
- [[A Python distribution is a build choice so the same version number differs in signing and linkage]] — 같은 버전 번호가 배포 채널마다 다른 산출물이라는 인접 사례

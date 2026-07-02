---
created: 2026-05-05 15:36
updated: 2026-05-05 15:53
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[rebellions - fde]]"
tags:
  - tensorrt-llm
  - nvidia
  - graph-optimization
  - latency
  - kernel-fusion
publish: true
---
## proceeding
- [[GPU 추론 최적화 개념 지도 - 커널 퓨전·JIT·ONNX]]

## 1. 개요 (Overview)
TensorRT-LLM은 NVIDIA GPU에서 LLM 추론 성능을 극한으로 끌어올리기 위해 설계된 오픈소스 라이브러리입니다.
NVIDIA의 추론 최적화 엔진인 TensorRT를 기반으로 LLM에 특화된 기능을 통합한 형태입니다.

## 2. 핵심 기술: 그래프 최적화 및 커널 퓨전
vLLM이 메모리 관리에 집중한다면, TensorRT-LLM은 **연산 자체의 속도(Compute Speed)**에 집중합니다.

- **커널 퓨전 (Kernel Fusion)**: 여러 개의 개별 연산(예: Attention, LayerNorm, Activation)을 하나의 거대한 GPU 커널로 합쳐 실행합니다. 이로 인해 메모리 I/O 오버헤드가 줄어들고 실행 속도가 빨라집니다.
- **그래프 컴파일 (Graph Compilation)**: 모델 전체 구조를 분석하여 불필요한 연산을 제거하고, 하드웨어 아키텍처(예: Hopper H100)에 최적화된 실행 순서로 모델을 다시 빌드합니다.
- **FP8 전용 최적화**: 최신 NVIDIA GPU에서 지원하는 FP8 데이터 타입을 활용하여 정확도 손실을 최소화하면서 연산 속도를 2배 이상 높입니다.

## 3. 주요 특징
- **In-flight Batching**: vLLM의 Continuous Batching과 유사하게 대기 중인 요청을 동적으로 배치에 포함시켜 처리량을 높입니다.
- **Quantization 지원**: AWQ, GPTQ, SmoothQuant 등 최신 양자화 기법을 하드웨어 레벨에서 가속합니다.
- **NVIDIA 전용**: NVIDIA GPU 하드웨어 특성에 깊게 유착되어 있어, NVIDIA 인프라에서는 타의 추종을 불허하는 성능을 냅니다.

## 4. 성능 지표 (KPI)
- **TTFT (Time To First Token)**: 첫 번째 토큰이 출력될 때까지의 시간을 최소화하여 사용자 체감 속도를 높입니다.
- **Latency (지연 시간)**: 단일 요청에 대한 처리 속도가 매우 빨라 실시간 대화형 서비스에 최적입니다.

## 5. FDE 관점의 인사이트
리벨리온의 NPU는 NVIDIA GPU와 경쟁 관계에 있습니다. 고객이 "NVIDIA의 TensorRT-LLM처럼 강력한 최적화 툴이 리벨리온에도 있나요?"라고 물었을 때, 리벨리온의 SDK(Rebel SDK 등)가 제공하는 그래프 최적화 및 커널 레벨 최적화 역량을 TensorRT-LLM과 비교하여 기술적으로 설명할 수 있어야 합니다.

## succeeding
- [[vLLM-PagedAttention]]

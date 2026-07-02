---
created: 2026-05-05 15:36
updated: 2026-05-05 15:53
subject: "[[AI]]"
project: "[[rebellions - fde]]"
type: study
status: 2-stable
tags:
  - vllm
  - pagedattention
  - llm-serving
  - throughput
  - memory-optimization
publish: true
---
## 1. 개요 (Overview)
vLLM은 High-throughput(고처리량) LLM 서빙을 위해 설계된 오픈소스 라이브러리입니다. 
운영체제의 가상 메모리 관리에서 영감을 받은 **PagedAttention** 기술을 통해 KV 캐시(Key-Value Cache) 메모리 관리를 혁신하여 성능을 극대화합니다.

## 2. 핵심 기술: PagedAttention
기존 서빙 방식은 요청의 최대 길이에 맞춰 연속적인 메모리 공간을 미리 할당해야 했습니다. 이는 메모리 파편화(Fragmentation)와 낭비를 초래합니다.

- **원리**: KV 캐시를 고정된 크기의 **'페이지(Page)'** 단위로 분할하여 비연속적인 물리 메모리에 저장합니다.
- **장점**:
    - **파편화 제거**: 실제 사용되는 만큼만 페이지를 할당하여 메모리 낭비를 4% 미만으로 줄입니다.
    - **메모리 공유**: 동일한 프롬프트를 공유하는 여러 요청(Parallel Sampling, Beam Search 등)이 동일한 물리 페이지를 참조하게 하여 메모리 효율을 극대화합니다.
    - **높은 배치 사이즈**: 메모리 효율이 높아짐에 따라 한 번에 처리할 수 있는 요청 수(Batch Size)가 늘어나고, 이는 전체 시스템의 **Throughput(처리량)** 향상으로 이어집니다.

## 3. 주요 특징
- **Continuous Batching**: 새로운 요청이 들어오면 기존 작업이 끝날 때까지 기다리지 않고 즉시 배치에 합류시키는 기술.
- **다양한 하드웨어 지원**: NVIDIA GPU뿐만 아니라 AMD, Intel 가속기를 지원하며, 리벨리온과 같은 NPU 제조사들이 자사 하드웨어에 이식하기 위해 벤치마킹하는 표준 모델입니다.
- **사용 편의성**: Python 기반 인터페이스로 HuggingFace 모델과 연동이 매우 쉽습니다.

## 4. 성능 지표 (KPI)
- **Throughput (초당 토큰 처리량)**: HuggingFace Text Generation Inference(TGI) 대비 2~4배 높은 처리량을 보여줍니다.
- **Latency**: 메모리 관리 효율 덕분에 대규모 동시 접속 상황에서도 안정적인 지연 시간을 유지합니다.

## succeeding
- [[TensorRT-LLM]]
- [[Attention 개념 정리]]
- [[kv-cache]]

---
created: 2026-04-28 11:31
updated: 2026-04-28 11:31
status: 1-draft
type: insight
subject: "[[CS]]"
project: "[[Edge AI LMR]]"
tags:
  - pytorch
  - gpu
  - parallelism
  - performance
  - systems
publish: true
---
## 핵심 전제

CPU와 GPU의 속도 차이는 "병렬 연산 여부"가 아니라 "병렬 폭의 차이"다.  
CPU도 배치 처리가 가능하며, 병목의 실체는 연산량보다 순차 의존성 유무에 있다.

---

## CPU도 배치 처리가 가능하다

PyTorch는 MKL(Intel Math Kernel Library) 또는 OpenBLAS를 백엔드로 사용해 CPU의 모든 코어와 SIMD 명령어(AVX2/AVX-512)를 자동으로 활용한다.

```
GPU: 수천 코어 × SIMD → 수만 병렬
CPU: 수십 코어  × SIMD → 수백 병렬
```

원리는 동일하고 규모만 다르다. 배치 처리가 가능한 작업이라면 CPU도 모든 코어를 동시에 활용한다.

---

## 배치 가능 여부가 속도를 결정한다

같은 작업이라도 순차 의존성이 있으면 병렬화가 불가능하다.

배치 가능한 작업 (특징 추출):
- 32장을 한 번에 백본에 통과 → CPU 전체 코어 활용
- 8 배치 × 2.36초 = ~19초

순차 의존성이 있는 작업 (Coreset Greedy Sampling):
- 스텝 n+1은 스텝 n의 결과(현재 선택 집합)를 알아야 실행 가능
- 병렬화 불가 → 25,000번 순차 실행
- 단계당 250,880벡터 × 1,536차원 거리 계산

```
연산량 비교:
  특징 추출: 245장 × 11 GFLOPs = 2.7 TFLOPs
  Coreset:  25,088스텝 × 771 MFLOPs = 19.4 TFLOPs  (7배)

속도 비교 (CPU):
  특징 추출: ~19초   ← 배치 가능, 병렬
  Coreset:  ~수 시간 ← 순차 의존성, 직렬
```

Coreset이 GPU에서 빠른 이유: 동일한 순차 구조이지만, 스텝당 거리 계산이 CUDA에서 수ms로 처리되어 25,000번 반복의 총 비용이 수 분으로 수렴한다.

<!-- 💡 스텝당 거리 계산 = 나머지 벡터 전체(~25,000개)와 현재 선택 집합 사이의 유클리드 거리를 한 번에 계산하는 것. 각 벡터의 거리 계산은 서로 독립적이므로 GPU가 수천 코어로 동시에 처리할 수 있다. CPU는 코어 수가 적어 순서대로 처리하므로 스텝 하나의 시간이 길어진다. → [[딥러닝 학습 vs 추론 - 순전파·역전파와 비용 구조]], [[병렬 처리 - CPU와 GPU의 코어 구조 차이]] -->

---

## Python GIL과 CUDA 비동기 dispatch

Python GIL(Global Interpreter Lock)은 한 번에 하나의 스레드만 Python 바이트코드를 실행하도록 강제한다.  
그럼에도 GPU 95% 활용이 가능한 이유는 PyTorch CUDA 연산이 비동기이기 때문이다.

```
Python 메인 스레드 (GIL 보유):
  커널 dispatch → CUDA 큐에 등록, 즉시 반환
  커널 dispatch → CUDA 큐에 등록, 즉시 반환
  커널 dispatch → CUDA 큐에 등록, 즉시 반환

GPU (독립 실행):
  큐 작업 1 처리 중...
  큐 작업 2 처리 중...
  큐 작업 3 처리 중...
```

Python은 GPU 완료를 기다리지 않고 다음 dispatch를 계속 보낸다. GPU는 큐를 자율적으로 소화한다.

GPU 학습 중 CPU 1코어 100%의 실체:
- CUDA 커널 dispatch 시 Python 레벨 오버헤드 (shape 검증, dtype 확인, autograd 그래프 기록)
- GPU 텐서 → CPU 메모리 복사 후 feature bank에 concatenation
- DataLoader 워커 프로세스 조율

단순한 명령 전달이 아니라, 배치마다 반복되는 Python 레벨 작업이 누적된다.

---

## GPU Starvation

GPU가 빠를수록 Python dispatch가 상대적 병목이 된다.

```
현재 GPU (배치당 50ms 처리):
  dispatch 2ms │ GPU 작업 50ms ─────────────│ 반복
  GPU 유휴율 ~4%

10배 빠른 GPU (배치당 5ms 처리):
  dispatch 2ms │ GPU 5ms │ 대기 45ms │ 반복
  GPU 유휴율 ~90%  ← GPU Starvation
```

해결책: 배치 크기 극대화  
dispatch 횟수를 줄이는 것이 가장 단순하고 효과적이다. GPU 메모리 한도까지 배치 크기를 키우면 배치당 GPU 작업 시간이 늘어나 Python 오버헤드가 희석된다.

---

## 현업의 GIL 우회 전략

| 방법                      | 원리                                       | 적용 단계            |
| ----------------------- | ---------------------------------------- | ---------------- |
| 배치 크기 극대화               | dispatch 횟수 절감                           | 학습·추론 공통         |
| `torch.compile`         | Python 루프를 C++ 그래프로 컴파일, GIL 진입 감소       | 학습 (20~40% 가속)   |
| CUDA Graph              | 반복 연산 패턴을 GPU에 캡처, Python dispatch 완전 제거 | 추론에 특히 효과적       |
| TensorRT / ONNX Runtime | C++/CUDA만으로 추론, Python 없음                | 프로덕션 추론          |
| Triton Inference Server | NVIDIA C++ 추론 서버, GPU 배치 자동 관리           | 프로덕션 표준          |
| multiprocessing         | 프로세스 간 GIL 비공유                           | DataLoader 이미 적용 |
| Python 3.13 No-GIL      | GIL 자체 제거 (실험적)                          | PyTorch 생태계 미성숙  |

---

## 인라인 자동화 전환 시 아키텍처 경로

```
수동 UI (프로토타입):
  사람 → 버튼 → Python → 추론 → 화면 표시

인라인 자동화 (양산):
  카메라 트리거 → C++ 데몬 → TensorRT 추론 → DB/PLC 기록
  (Python 없음, GIL 없음, UI 없음)
```

Python 기반 추론 서버는 프로토타입 검증 단계까지만 유효하다.  
처리량이 중요해지는 시점에 TensorRT + C++ 데몬으로 전환하는 것이 현장 표준 경로다.

---

## 관련 노트

- [[이미지 기반 이상탐지 - PatchCore와 메모리 뱅크 패턴]] — Coreset 알고리즘의 동작 원리 및 비용 구조
- [[병렬 처리 - CPU와 GPU의 코어 구조 차이]] — 코어 구조, SIMD, 병렬화 가능 조건
- [[딥러닝 학습 vs 추론 - 순전파·역전파와 비용 구조]] — 학습/추론의 연산량·메모리 비용 비교

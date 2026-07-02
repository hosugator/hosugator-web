---
created: 2026-05-13
updated: 2026-05-15
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - gpu
  - cuda
  - kernel-fusion
  - jit
  - onnx
  - tensorrt
  - inference
publish: true
---
## 추론 최적화 엔진 계층 구조

```
추론 최적화 엔진 (TensorRT, ONNX Runtime 등)
  ├── 그래프 컴파일 (실행 방식 최적화, 모델 불변)
  │     ├── 커널 퓨전
  │     ├── 불필요 연산 제거
  │     └── 실행 순서 최적화
  └── 모델 경량화 (모델 가중치 자체 변경)
        ├── 양자화 (FP32 → FP8, 정밀도 축소)
        ├── 프루닝 (불필요 가중치 제거)
        └── 증류 (큰 모델 → 작은 모델 압축)
```

## CUDA = GPU의 OS

```
CPU 세계                    GPU 세계
Linux/Windows (OS)    ↔    CUDA (GPU 접근 계층)
PyTorch/C++ 앱        ↔    PyTorch (CUDA 위의 라이브러리)
CPU 코어              ↔    SM (Streaming Multiprocessor)
ALU                   ↔    CUDA 코어 (SM 내부 연산 장치)
```

CUDA가 해자인 이유: 하드웨어가 아니라 10년치 최적화 라이브러리(cuDNN, cuBLAS) 생태계.

## 혼동 주의: OS 커널 ≠ GPU 커널

|       | OS 커널        | GPU 커널 (CUDA 커널)     |
| ----- | ------------ | -------------------- |
| 역할    | 시스템 전체 관리자   | 특정 연산을 수행하는 함수 단위    |
| 존재    | 항상 실행 중 (1개) | 호출 시 생성, 끝나면 소멸 (다수) |
| 유사 개념 | 공장장          | 작업 지시서               |

추론 최적화 엔진(TensorRT)은 OS 커널이 아니라 **CUDA 위의 애플리케이션**이다.

## 커널 퓨전 원리

GPU 커널(함수)들은 기본적으로 메모리(VRAM)로 통신한다.

```
퓨전 전
  커널 A(matmul) → 결과를 VRAM에 저장
  커널 B(softmax) → VRAM에서 읽어옴 → 결과를 VRAM에 저장
  커널 C(dropout) → VRAM에서 읽어옴 → 결과를 VRAM에 저장

퓨전 후
  커널 ABC → A 결과를 레지스터에 유지
              B가 레지스터에서 바로 읽음
              C가 레지스터에서 바로 읽음
              최종 결과만 VRAM에 저장
```

**퓨전 한계**: 중간 결과가 레지스터 용량을 초과하면 퓨전 불가. 전체 레이어를 하나로 합치는 게 아니라 퓨전 가능한 구간을 탐색해서 부분 적용.

## JIT(torch.compile) vs ONNX — 완전히 별개 경로

```
ONNX 배포 경로
  PyTorch 모델
    └── torch.onnx.export() → model.onnx
         └── TensorRT / ONNX Runtime으로 실행
  JIT 사용 안 함
  
torch.compile(JIT) 경로
  PyTorch 모델
    └── torch.compile(model)
         └── 첫 실행 시 연산 그래프 분석
              └── 퓨전 가능한 조합을 CUDA 커널로 컴파일
                   └── FastAPI 서버에서 Python 환경 그대로 실행
  ONNX 변환 없음
```

**torch.compile 선택 기준**: 모델이 자주 바뀌거나(실험 단계), 커스텀 연산으로 ONNX 변환 불가하거나, 레이턴시 SLA가 느슨한 프로덕션. 20~50% 성능 향상.
**ONNX/TensorRT 선택 기준**: 레이턴시가 비즈니스 지표와 연결되는 프로덕션 표준. 2~6x 향상. Python 환경이어도 TensorRT를 쓴다(vLLM, TensorRT-LLM이 그 예).

> 비유: torch.compile ≈ 빠른 배포를 위한 FastAPI 단독 서빙 / TensorRT ≈ 극한 최적화를 위한 C++ 네이티브. Gradio처럼 "개발 전용"은 아니나, 성능 격차가 크므로 프로덕션에서는 TensorRT가 표준.

## ONNX 연산자(operator)와 opset

- **연산자**: relu, matmul, softmax처럼 "이 입력을 받아 이렇게 계산한다"고 미리 정의된 함수
- **opset**: 그 연산자들의 묶음 + 버전. opset 17 = "ONNX 표준이 인식하는 연산자 N개의 명세 v17"

```
torch.relu      →  opset의 Relu 연산자로 매핑  →  변환 성공
my_custom_op    →  opset에 없음               →  변환 실패
```

opset은 단순 라이브러리가 아니라 **스펙(명세)** 이다. ONNX Runtime, TensorRT, CoreML 등 각 런타임이 "opset 17을 지원한다"고 선언하면, 연산자 정의는 공통이지만 각 하드웨어에 맞는 구현은 런타임이 각자 담당한다.

## ONNX 변환 실패 케이스

**커스텀 CUDA 커널**: 연구자가 PyTorch 내장 연산 대신 직접 CUDA C++로 작성한 GPU 함수. Flash Attention 등. opset에 대응 연산자가 없어 매핑 불가.

**데이터 값에 따른 분기**: 실제 텐서 값으로 실행 경로가 바뀌는 구조. ONNX는 내보낼 때 한 경로만 추적하므로 분기를 표현 불가.
- **일반 학습 모델(ResNet, PatchCore, BERT)은 해당 없음** — 가중치가 고정된 순방향 계산이므로 ONNX 변환 잘 됨
- 특수 아키텍처에서만 발생: Early Exit(신뢰도 임계값 분기), MoE(입력별 전문가 선택), Object Detection NMS(박스 개수 가변)

**Dynamic shape**: 입력 크기가 매 추론마다 다른 경우. TensorRT도 지원하나 범위 명세 설정이 복잡함.

→ **결론**: 표준 아키텍처를 쓰는 경우(AOI 등) 기술적 강제 요인은 드물다. torch.compile을 선택하는 실질적 이유는 대부분 운영상 편의(모델 변경 빈도, 팀 역량)이며, 성능 목표가 있다면 TensorRT가 표준.

## JIT 동작 원리

```
torch.compile(model) 호출
  └── 모델 연산 그래프 구조를 한 번 분석
        └── 퓨전 가능한 연산 조합 탐색 (레지스터 용량 기준)
             └── 최적화된 CUDA 커널 생성
                  └── 이후 모든 추론에 적용
```

AOT(TensorRT)와 차이: 배포 전에 미리 컴파일 vs 첫 실행 직전(Just-In-Time)에 컴파일.
웜업(warmup): 서버 시작 시 더미 입력으로 미리 컴파일을 유발해두는 실무 관행.

## 관련 노트

- [[TensorRT-LLM]] — TensorRT 실제 적용 사례
- [[How to inference with sole object independent with language]] — ONNX 기반 배포 전략
- [[PyTorch GIL과 GPU Starvation - CPU·GPU 병렬성의 본질]] — GPU 추론 시 GIL 해제
- [[병렬 처리 - CPU와 GPU의 코어 구조 차이]] — SM, CUDA 코어 구조
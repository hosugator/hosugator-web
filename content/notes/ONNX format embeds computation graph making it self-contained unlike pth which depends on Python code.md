---
created: 2026-06-01
updated: 2026-06-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - onnx
  - pytorch
  - deployment
  - model-format
publish: true
---
## Context

align-ai의 `.pth` 모델을 Docker 이미지에 넣으려고 보니 torch만으로 5.8GB가 됐다. ONNX로 변환하면 onnxruntime만으로 추론할 수 있어 344MB로 줄어든다는 것을 직접 검증했다. 변환 과정에서 dummy input이 왜 필요한지 이해하게 됐다.

## Insight

### .pth는 가중치 딕셔너리, .onnx는 계산 그래프 + 가중치의 완전한 묶음이다

```
.pth 구조:
{"encoder.layer1.weight": tensor, "decoder.weight": tensor, ...}
→ Python 코드(smp.Unet(...))가 없으면 실행 불가

.onnx 구조:
계산 그래프 + 각 노드의 연산 타입 + shape + 가중치
→ Python 코드 없이 onnxruntime 하나로 실행 가능
```

### dummy input은 동작 확인이 아니라 shape 추적을 위해 필요하다

ONNX export는 모델을 실제로 실행하면서 각 레이어의 입출력 shape를 기록해 계산 그래프를 만든다. 가중치만으로는 shape를 알 수 없기 때문이다.

```python
dummy = torch.zeros(1, 1, IMG_H, IMG_W)  # shape만 맞으면 값은 무관
torch.onnx.export(model, (dummy,), "model.onnx")
# 실행하면서 (1,1,H,W) → (1,2,H,W) 등 shape 흐름을 기록
```

### 포맷 변환이 torch 제거보다 이미지 크기에 더 효과적이다

multi-stage build로는 torch 설치 캐시 정도만 줄일 수 있다. torch 자체가 수 GB라서 근본적으로 제거하려면 ONNX처럼 런타임 중립 포맷으로 전환해야 한다.

```
torch 기반 이미지:  5.8GB
onnxruntime 기반:  344MB  (17배 감소)
```

### onnxruntime은 기본적으로 모든 CPU 코어를 병렬로 사용한다

`docker stats`에서 CPU %가 1649.88%로 표시됐다. docker stats는 **전체 코어 합산** 기준으로 보고한다. 16코어 머신이면 코어당 100%씩 모두 사용 시 1600%가 된다. 이상이 아니라 onnxruntime이 행렬 연산을 최대 병렬로 처리한 것이다.

서버에서 다른 프로세스와 공존해야 한다면 스레드 수를 제한할 수 있다:

```python
opts = ort.SessionOptions()
opts.intra_op_num_threads = 4
model = ort.InferenceSession("model.onnx", opts)
```

## Related

- [[How to inference with sole object independent with language]] — ONNX가 가능하게 하는 런타임 독립성
- [[GPU 추론 최적화 개념 지도 - 커널 퓨전·JIT·ONNX]] — ONNX 최적화 맥락
- [[학습된 모델의 직렬화와 역직렬화]] — 모델 저장 포맷 전반
- [[Dockerignore reduces build context sent to daemon not the final image size]] — 같은 Docker 경량화 맥락
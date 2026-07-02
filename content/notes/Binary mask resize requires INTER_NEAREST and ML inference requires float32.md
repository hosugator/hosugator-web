---
created: 2026-06-04
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - opencv
  - onnx
  - inference
publish: true
---
## Context
predict_onnx.py 쉐도잉 adversarial review에서 두 가지를 몰랐다: 이진 마스크 resize 시 보간법 선택 이유, onnxruntime 입력 타입 요구사항.

## Insight
### 이진 마스크 resize는 반드시 INTER_NEAREST를 써야 한다
예측 마스크는 0(배경) 또는 255(라인)만 있는 이진값이다. `INTER_LINEAR`(기본값)은 경계에서 중간값을 생성해 이진 마스크를 오염시킨다.

```
INTER_NEAREST: 0, 0, 255, 255 → 0, 0, 255, 255  (이진 유지)
INTER_LINEAR:  0, 0, 255, 255 → 0, 60, 180, 255  (중간값 생성)
```

연속값 이미지(원본 사진)는 INTER_LINEAR가 맞고, 이진/레이블 마스크는 INTER_NEAREST가 맞다.

### ML 추론 입력은 float32여야 한다
numpy 기본값은 float64지만 onnxruntime(C++ 기반)과 torch(GPU 최적화)는 float32를 기대한다. float64를 넘기면 타입 불일치 에러가 발생한다.

```python
img_np = transformed["image"][np.newaxis, np.newaxis, :, :].astype(np.float32)
```

float64는 정밀도는 높지만 메모리와 연산 비용이 두 배라 ML에서는 거의 사용하지 않는다.

### onnxruntime InferenceSession은 문자열 경로를 받는다
torch.load()는 Path 객체를 받지만 onnxruntime은 C++ 기반이라 문자열만 받는다.

```python
torch.load(Path(...))                    # OK
ort.InferenceSession(str(path))          # OK
ort.InferenceSession(Path(...))          # ERROR
```

## Related
- [[model eval mode disables Dropout and fixes BatchNorm running stats for inference]] — 같은 추론 파이프라인 맥락
- [[Neural network computation graph connects nodes through runtime-allocated memory buffers]] — onnxruntime 내부 동작 원리

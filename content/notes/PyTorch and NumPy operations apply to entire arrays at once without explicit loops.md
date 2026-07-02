---
created: 2026-05-29
updated: 2026-05-29
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - python
  - numpy
  - pytorch
  - tensor
publish: true
---

## Context

predict.py 쉐도잉 중 `out.argmax(dim=1).squeeze().cpu().numpy() * 255` 체인을 보며 "각 픽셀에 값을 저장하려면 반복문이 있어야 하지 않나?"는 의문이 생겼다. 배열 연산이 전체에 한 번에 적용된다는 것을 다시 명확히 이해했다.

## Insight

### PyTorch·NumPy 연산은 배열 전체에 반복문 없이 한 번에 적용된다

```python
# out.shape = (1, 2, H, W)
out.argmax(dim=1)   # (1, H, W)  ← H×W 픽셀 전체에 동시 적용
.squeeze()           # (H, W)     ← 배치 차원 제거
.cpu().numpy()       # ndarray
* 255                # 모든 원소에 동시 곱셈
```

각 단계가 배열 전체를 대상으로 한 번에 실행된다. Python 반복문을 쓰면 픽셀마다 순차 처리지만, 이 연산들은 내부적으로 C/CUDA로 병렬 처리돼서 훨씬 빠르다.

### 체인의 각 단계는 shape 변환이다

```
(1, 2, H, W) → argmax(dim=1) → (1, H, W)   클래스 축 제거
             → squeeze()      → (H, W)       배치 축 제거
             → * 255          → (H, W)       값 스케일 변환 (0→0, 1→255)
```

중간 배열이 새로 생성되는 게 아니라 shape와 값이 변환되는 과정이다.

## Related

- [[GPU parallelism accelerates matrix computation within a single inference not across inferences]] — 이 병렬 연산이 GPU에서 실행되는 원리
- [[x corresponds to column index because both increase left to right]] — 같은 predict.py 쉐도잉 세션, 배열 인덱싱 맥락

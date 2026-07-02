---
created: 2026-05-27
updated: 2026-05-27
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - gpu
  - parallelism
publish: true
---

## Context

align-ai train.py 쉐도잉 중 val_loader가 직렬로 실행된다는 것을 이해하다가 "GPU는 원래 병렬 처리를 위한 것 아닌가?"라는 질문이 생겼다. GPU 병렬처리가 어느 수준에서 일어나는지 처음 명확히 파악했다.

## Insight

### GPU 병렬처리는 추론 간이 아니라 추론 내부 행렬 연산에서 일어난다

신경망의 뉴런 계산은 본질적으로 대규모 행렬 곱셈(`W × x`)이다. GPU는 이 행렬의 원소들을 수천 개의 코어가 동시에 계산한다. 즉 **하나의 이미지를 처리하는 동안** 뉴런들의 계산이 병렬로 일어난다.

```
for loop: 이미지 1 → 처리 → 이미지 2 → 처리 → ...  (직렬)
GPU 내부: 이미지 1의 뉴런 수만 개 동시 계산          (병렬)
```

### batch_size가 추론 간 병렬처리 역할을 한다

여러 이미지를 동시에 처리하고 싶다면 batch_size를 키우면 된다. batch_size=8이면 이미지 8장의 행렬 연산이 GPU에서 한 번에 처리된다. val_loader의 batch_size=1은 GPU를 비효율적으로 쓰는 것이 맞으나, `compute_detect_rate`의 구조적 제약으로 어쩔 수 없다.

## Related

- [[Backpropagation computes gradient direction without trying random weights]] — GPU 병렬처리 위에서 일어나는 역전파 구조

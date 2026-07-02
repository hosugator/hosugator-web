---
created: 2026-06-04
updated: 2026-06-04
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml
  - pytorch
  - inference
  - training
publish: true
---
## Context
export_onnx.py 쉐도잉 중 `model.eval()` 호출이 왜 필수인지 추적했다. "가중치를 고정하기 위해"라는 오해가 있었고, 실제 이유는 두 레이어의 동작 방식 전환이었다.

## Insight
### model.eval()은 가중치가 아니라 레이어 동작을 바꾼다

가중치 고정은 `torch.no_grad()`의 역할이다. `model.eval()`은 두 가지를 바꾼다:
**Dropout**: train 모드에서는 일부 뉴런을 무작위로 끈다(과적합 방지). eval 모드에서는 전부 켠다. 추론 시 끄면 같은 입력에 다른 출력이 나온다.
**BatchNorm**: train 모드에서는 현재 미니배치의 mean/std로 중간 출력값을 정규화한다. eval 모드에서는 학습 중 누적된 running mean/std(고정값)를 사용한다. export 시 eval을 안 하면 dummy 배치 1개의 통계로 잘못된 그래프가 ONNX에 구워진다.

### BatchNorm은 입력 이미지 정규화와 다른 개념이다

입력 정규화(mean=0.5, std=0.5)는 픽셀값을 모델에 넣기 전에 스케일을 맞추는 것이다. BatchNorm은 레이어 사이의 중간 출력값을 정규화하는 것으로 레이어가 다르다.

```
입력 이미지 → [입력 정규화] → Conv → [BatchNorm] → 다음 레이어
```

### 미니배치와 에포크의 관계

```
전체 데이터 100장, 배치 크기 2
→ 1 에포크 = 50 미니배치 = 50번 가중치 업데이트
```

BatchNorm의 running stats는 이 50번의 미니배치 통계를 누적 평균한 값이다. eval 모드는 이 누적값을 고정해서 사용한다.

## Related
- [[학습된 모델의 직렬화와 역직렬화]] — pth/onnx 직렬화 맥락
- [[Normalization centers data and unifies scale not constrains range]] — 입력 정규화(mean/std)와의 구분
- [[Shadowing requires spec-first and adversarial review to build judgment not just familiarity]] — 이 인사이트가 나온 쉐도잉 맥락

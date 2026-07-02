---
created: 2026-06-16
updated: 2026-06-16
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - ml-training
  - checkpoint
  - onnx
  - resume
publish: true
---
## Context
hesung 모델 학습 중 `latest.pth`를 best epoch 가중치로 복사하다 보니, resume 시 epoch 5(blob 탐지 상태)에서 재시작되는 버그가 발생했다. "latest인데 왜 이전 상태로 돌아가지?"라는 혼란에서 출발했다.

## Insight
### 파일 하나에 두 역할을 섞으면 반드시 충돌한다

ML 체크포인트는 목적이 다른 세 가지 파일로 분리해야 한다:

| 파일 | 역할 | 내용 |
|---|---|---|
| `latest.pth` | resume 전용 | 마지막 epoch 가중치 — 학습을 이어가는 시작점 |
| `best_vN.pth` | best 기록 | 해당 run에서 val 기준 최고 epoch 가중치 |
| `best_vN.onnx` | 배포 전용 | C++/엣지 추론용, latest.onnx는 만들지 않음 |

`latest = best 복사` 방식은 "resume = 가장 좋은 상태에서 재시작"이라는 직관적으로 그럴듯한 논리지만, best가 blob 탐지 구간(초반 epoch)이면 resume이 실제로는 퇴보가 된다.

### latest.pth는 매 epoch 덮어써야 진정한 latest다

```python
# 매 epoch 끝에
torch.save(model.state_dict(), ckpt_dir / "latest.pth")

# best는 별도 기준(val_loss 등)으로만 갱신
if val_loss < best_val_loss:
    torch.save(model.state_dict(), ckpt_path)  # best_vN.pth
```

### onnx 버전 관리: latest.onnx 없음

`latest.onnx`는 "지금 가장 좋은 배포본"이 아니다. 학습 run마다 `best_vN.onnx`를 명시적으로 export하고, 배포 시 버전을 지정한다. "자동으로 최신"이라는 묵시적 규칙은 나쁜 모델이 조용히 배포되는 통로가 된다.

## Related
- [[DiceLoss prevents all-background collapse in sparse foreground segmentation]] — blob 탐지 구간이 생기는 이유
- [[Table-driven product config eliminates scattered conditionals in ML pipelines]] — 다중 제품 체크포인트 관리

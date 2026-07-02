---
created: 2026-06-01
updated: 2026-06-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Align AI]]"
tags:
  - onnx
  - preprocessing
  - refactoring
  - deployment
publish: true
---
## Context

align-ai predict.py를 ONNX 기반으로 전환하면서, 모델 변환(export_onnx.py)보다 전처리 파이프라인 분리에 더 많은 작업이 필요했다. `ToTensorV2`가 torch에 의존하기 때문에 발생한 연쇄 문제였다.

## Insight

### ToTensorV2는 torch에 묶여 있어 ONNX 전용 환경에서 쓸 수 없다

`from albumentations.pytorch import ToTensorV2`는 내부적으로 torch를 import한다. torch 없는 Docker 이미지에서 이 import가 실행되면 바로 실패한다.

### Python import는 모듈 전체를 실행한다

`from predict import TRANSFORM`처럼 일부만 가져와도 `predict.py` 전체가 실행된다. 파일 상단의 `import torch`가 실행되면서 torch 없는 환경에서 실패한다. 이 때문에 공유 코드를 별도 모듈로 분리해야 했다.

### 해결 구조: torch 의존 여부로 모듈을 분리한다

```
utils.py           ← torch 의존 없음 (공유)
  - TRANSFORM (ToTensorV2 제외)
  - extract_lines
  - resolve_model_version

predict.py         ← torch 필요 (학습 환경)
  - TRANSFORM (ToTensorV2 포함)
  - load_model (smp.Unet + torch.load)

predict_onnx.py    ← onnxruntime만 필요 (배포 환경)
  - load_model (ort.InferenceSession)
  - numpy 직접 변환 (ToTensorV2 대신)
```

### 전처리 파이프라인이 배포 경계를 결정한다

모델 아키텍처(U-Net)는 ONNX로 투명하게 변환됐다. 실제 작업은 전처리가 어디에 의존하는지 파악하고 분리하는 것이었다. 다음 프로젝트에서 ONNX를 고려한다면 전처리를 처음부터 torch 의존 없이 설계하는 게 낫다.

## Related

- [[ONNX format embeds computation graph making it self-contained unlike pth which depends on Python code]] — ONNX 변환의 개념적 배경
- [[Dockerignore reduces build context sent to daemon not the final image size]] — 같은 Docker 경량화 맥락

---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 1-draft
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - diffusion
  - vit
  - dit
publish: true
---
## Context
2025-2026 아키텍처 트렌드 리서치. 비전 생성 모델의 백본이 CNN에서 Transformer로 전환된 시점 파악.

## Insight
### 생성 모델 백본이 U-Net(CNN)에서 DiT(Transformer)로 교체됐다

Stable Diffusion 1.x/2.x는 U-Net 구조(CNN + skip connection)를 썼다. 2024~2025년 기준 Flux.1, Sora, Veo 3 등 주요 생성 모델이 모두 DiT로 전환했다.

```
SD 1.x/2.x: U-Net (CNN 기반) ← 과거
Flux.1, SD3, Sora, Veo 3: DiT (Transformer 기반) ← 현재 주류
```

DiT는 이미지를 패치 단위 토큰으로 취급해서 Transformer의 Self-Attention으로 처리한다. 텍스트와 이미지 토큰 스트림 간 Cross-Attention을 수행하는 **MM-DiT 블록** 구조가 핵심이다.

### ViT 자체도 LLM 기법을 흡수하는 중이다

ViT-5(2026): RoPE 위치 인코딩, SwiGLU 활성화, Pre-norm, Register 토큰 등 LLM에서 검증된 기법을 ViT에 이식. ImageNet top-1 84.2% 달성.
새로운 패러다임이 아니라 LLM에서 검증된 구성요소의 비전 이식이다.

### 비전 이상탐지에서의 직접 영향

현재 PatchCore 같은 이상탐지 방법론은 U-Net이 아닌 CNN feature extractor를 쓰므로 직접 영향 없음. 단, 특징 추출기로 ViT 기반 모델을 사용하는 방향이 늘고 있어 중기적으로 관련성 생길 수 있음.

## Related
- [[CNN shares one kernel across spatial positions to detect location-invariant patterns]] — DiT가 대체한 구조의 원리
- [[Transformer computes all token relationships simultaneously through QKV attention]] — DiT가 채택한 구조의 원리
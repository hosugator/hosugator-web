---
created: 2026-06-17
updated: 2026-06-17
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - architecture
  - moe
  - frontier
publish: true
---
## Context
2025-2026 최신 아키텍처 트렌드 리서치 중 파악. MoE가 "실험적 선택"에서 "기본값"으로 전환된 시점.

## Insight
### MoE는 더 이상 선택지가 아니라 기본값이다

2025년 기준 주요 랩의 프론티어 모델 전원이 Sparse MoE를 채택했다.

```
DeepSeek-V3: 671B 전체 / 37B 활성  (~5.5%)
Llama 4 Maverick: 400B / 17B      (~4%)
Qwen3-235B:  235B / 22B           (~9%)
Mistral Small 4: 119B / 6B        (~5%)
```

전체 파라미터의 5~10%만 활성화한다. 나머지는 현재 토큰과 관련 없는 전문가(expert)이고 계산에 참여하지 않는다.

### DeepSeek의 Auxiliary-Loss-Free 로드 밸런싱이 표준이 됐다

기존 MoE는 전문가 편중을 막으려고 보조 손실(auxiliary loss)을 추가했는데, 이게 주 학습을 방해하는 부작용이 있었다.
DeepSeek-V3는 보조 손실 없이 토큰별 동적 바이어스 조정으로 전문가 부하를 균등화했다. 이 방식이 현재 업계에서 광범위하게 인용/채택 중이다.

## Related
- [[Transformer computes all token relationships simultaneously through QKV attention]] — MoE가 대체하는 게 아니라 그 위에 올라타는 구조
- [[ML backbone lineage evolves by solving the predecessor bottleneck]] — 구조 선택의 역사적 맥락
- [[SSM-Attention hybrid layers achieve Transformer quality with fewer training tokens]] — MoE와 함께 등장하는 또 다른 효율화 방향
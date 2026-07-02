---
created: 2026-06-17
updated: 2026-07-01
type: study
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - inference
  - reasoning
  - scaling
publish: true
---
## Context
2025-2026 아키텍처 트렌드 리서치. "더 큰 모델" 방향이 아닌 "추론 시 더 많이 생각하기" 방향이 독립적인 트렌드로 부상했음을 파악.

## Insight
### 추론 시 연산량이 새로운 능력 축이 됐다

기존: 파라미터 수 ↑ → 능력 ↑  
2025년 추가된 축: 추론 연산 ↑ → 능력 ↑ (모델 크기 고정)

```
Qwen3:         reasoning_effort 파라미터로 CoT 토큰 수 동적 조절
Mistral Small 4: 같은 파라미터, 다른 thinking depth
Gemini Deep Think: 추론 예산 조절 가능
```

하나의 모델 파일로 빠른 응답과 깊은 추론을 상황에 따라 전환한다.

### Forward pass란

입력 토큰들이 레이어를 앞방향으로 한 번 통과하는 것. 매 pass마다 토큰 1개가 생성된다.

```
입력 토큰들 → Attention → FFN → ... → softmax → 토큰 1개 선택
```

추론 시에는 가중치 업데이트 없이 forward pass만 반복한다. 토큰 10개 생성 = forward pass 10회.

### 엣지에서의 의미

추론 예산 조절이 가능하면 같은 모델을 "빠른 모드"와 "정확한 모드"로 운영할 수 있다. 온디바이스 배포 시 실시간성 요구에 따라 품질을 동적으로 조정하는 방향으로 발전 가능.

## Related
- [[CoT and hidden state recurrence differ only in whether intermediate reasoning is externalized]] — 두 구현 방향 상세 및 동일성 인사이트
- [[Test-time compute scaling only improves tasks where the answer is absent from input]] — 적용 경계 인사이트
- [[SSM-Attention hybrid layers achieve Transformer quality with fewer training tokens]] — 학습 효율 vs 추론 효율, 다른 각도의 스케일링
- [[Frontier models converged on sparse MoE with under 10 percent active parameters by 2025]] — MoE도 추론 연산 절감 방법 중 하나
- [[ML backbone lineage evolves by solving the predecessor bottleneck]] — 각 세대가 해결하는 병목의 역사

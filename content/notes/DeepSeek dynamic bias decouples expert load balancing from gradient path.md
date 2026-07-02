---
created: 2026-06-25
updated: 2026-06-25
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[DTK in 2026]]"
tags:
  - deep-learning
  - moe
  - training
  - deepseek
publish: true
---
## Context
MoE 학습에서 특정 expert로 토큰이 몰리는 collapse 문제를 해결하는 방식 비교. 기존 보조 손실과 DeepSeek-V3의 동적 바이어스가 왜 다른지 파악했다.

## Insight
### 기존 보조 손실은 같은 gradient 경로를 두 목표가 공유해서 충돌한다

```
loss = CrossEntropy(예측, 정답) + λ × L_balance

L_balance = N × Σ(f_i × p_i)
  f_i: 이번 배치에서 expert_i가 선택된 비율
  p_i: router가 expert_i에 부여한 평균 확률 (softmax 출력)
```

`p_i`가 router의 파라미터에서 나오므로 `L_balance`에 gradient가 흐른다:

```
CrossEntropy 최소화 → "가장 잘 처리하는 expert의 p_i를 높여라"
L_balance 최소화  → "p_i를 균등하게 낮춰라"
→ 같은 router 파라미터에 반대 방향 gradient가 동시에 누적
```

`λ`를 조절해도 둘 중 하나를 포기해야 하는 트레이드오프가 남는다.

### DeepSeek 동적 바이어스는 균등화를 gradient 경로 밖으로 꺼냈다

```
router 점수 = 학습된 점수 + bias_i
                    ↑              ↑
              gradient로       부하 측정으로
              업데이트 (품질)    직접 조정 (균등화)
```

`bias_i`는 배치마다 부하를 측정해서 직접 보정한다. gradient를 통하지 않으므로 주 학습 목표와 충돌하지 않는다:

```
expert_i가 과부하 → bias_i를 낮춤 → 다음 배치에서 덜 선택됨
expert_i가 한가함 → bias_i를 높임 → 다음 배치에서 더 선택됨
```

학습 신호는 오직 "다음 토큰을 잘 예측해라" 하나. 균등 분배는 별도 규칙으로 기계적으로 강제된다.

### 핵심 차이

| | 방식 | 문제 |
|---|---|---|
| 보조 손실 | gradient로 균등화 유도 | 주 학습 목표와 gradient 충돌 |
| 동적 바이어스 | 부하 측정 후 점수 직접 보정 | 충돌 없음 |

두 목표를 하나의 손실 식에서 분리한 게 아니라, 균등화를 **gradient 경로 자체에서 제거**한 것이 핵심이다.

## Related
- [[Expert specialization in MoE emerges from gradient source separation not data separation]] — 전문화가 수렴되는 원리
- [[Frontier models converged on sparse MoE with under 10 percent active parameters by 2025]] — Auxiliary-Loss-Free 방식이 업계 표준으로 채택된 배경

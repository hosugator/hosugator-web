---
created: 2026-07-01
updated: 2026-07-01
type: insight
status: 2-stable
subject: "[[AI]]"
project: "[[Self-development in 2026]]"
tags:
  - machine-learning
  - peft
  - lora
  - fine-tuning
  - llm
  - deep-learning
publish: true
---
## 저랭크 분해란
행렬을 **두 개의 작은 행렬의 곱**으로 표현하는 수학적 기법.

```
원래 가중치 행렬 W (1000 × 1000) = 100만 개 파라미터
              ↓  저랭크 분해 (rank = 4)
A (1000 × 4)  ×  B (4 × 1000)  = 8천 개 파라미터  (125배 감소!)
```

> `rank`(랭크) = 두 행렬이 공유하는 중간 차원. rank가 작을수록 파라미터 수가 적고 빠르다.  
> rank가 너무 작으면 표현력 부족, 너무 크면 PEFT의 의미가 줄어든다. 보통 4~16을 실험한다.

## LoRA의 작동 방식
W를 직접 수정하지 않고, **변화량 ΔW = A × B** 만 학습한다.

```
최종 출력 = W(고정) + A×B(학습)
           └ 사전학습 지식 보존  └ 태스크 적응
```

## 직렬이 아닌 병렬인 이유
두 가지 이유가 있다.

**① 수학적 동치**: Full Fine-tuning의 `(W + ΔW)·x`를 전개하면 `W·x + ΔW·x`다. LoRA의 `W·x + B·A·x`와 구조가 동일하다. 직렬(`B·A·(W·x)`)은 이 수식과 맞지 않는 별개의 연산이 된다.
**② 추론 시 합병 가능**: 병렬이기 때문에 학습 후 `W' = W + B·A`로 합칠 수 있다. 합치면 원래 모델과 레이어 구조가 동일해서 추론 속도 손실이 없다. 직렬이면 B×A 레이어가 추론 시에도 항상 추가로 붙는다.

## B를 0으로 초기화하는 이유

```python
self.B.weight.data.zero_()
```

학습 시작 시점에 `B·A = 0`이 되어야 LoRA를 붙이기 전과 모델 출력이 동일하다. W에서 잘 작동하던 초기 상태를 그대로 유지한 채로 점진적으로 보정을 학습한다.

## VRAM 절감의 실체
파라미터 자체(W)는 frozen이어도 VRAM에 올라간다. 절감되는 항목은 따로 있다.

```
Full Fine-tuning:
  그래디언트          14GB (파라미터와 동일 크기)
  옵티마이저 상태     28GB (Adam: momentum + variance)
  합계 추가 소요      42GB

LoRA:
  그래디언트 (A, B)   ~100MB
  옵티마이저 상태     ~200MB
  합계 추가 소요      ~300MB
```

W가 역전파 대상이 아니므로 그래디언트와 옵티마이저 상태를 저장하지 않아도 된다. 이것이 소비자용 GPU를 가능하게 하는 실제 절감 항목이다.

## Related
- [[PEFT method selection depends on model access level and structural constraints]] — LoRA가 속한 PEFT 분류 허브
- [[전이 학습 - 사전학습 모델 재사용 전략]] — 전략 선택 기준 및 레이어 구조
- [[self-attention]] — LoRA가 주로 적용되는 attention 가중치 행렬(Q, K, V)

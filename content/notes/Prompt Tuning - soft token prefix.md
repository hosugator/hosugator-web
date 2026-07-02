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
  - fine-tuning
  - llm
  - prompt-engineering
publish: true
---
## 소프트 토큰이란
일반 텍스트 토큰이 아닌, **학습 가능한 숫자 벡터(soft token)** 를 프롬프트 앞에 추가하는 기법.

```
일반 프롬프트:    "이 리뷰의 감성을 분류하시오: [리뷰 내용]"
Prompt Tuning:   [v1][v2][v3][v4] + "이 리뷰의 감성을 분류하시오: [리뷰 내용]"
                  ↑ 사람이 읽을 수 없는 숫자 벡터 — 학습으로 최적화됨
```

- 모델 가중치는 건드리지 않는다.
- **"모델(열쇠)은 그대로, 입력(자물쇠)을 맞춤 제작"** 하는 방식.

## 소프트 토큰은 임베딩 테이블을 우회한다
일반 토큰은 `단어 → ID → 임베딩 테이블 조회 → 고정 벡터` 경로를 거친다. 소프트 토큰은 이 과정이 없다.

```python
self.soft_tokens = nn.Parameter(torch.randn(n_tokens, embed_dim))
# nn.Parameter = gradient가 흐르는 학습 가능한 raw 텐서
# 임베딩 테이블 조회 없이 처음부터 벡터로 존재한다
```

어휘집에 없는 의미 조합도 표현할 수 있는 이유다. 사람이 쓰는 "너는 감정 전문가야"는 실제 단어로 제한되지만, 소프트 토큰은 gradient가 찾아낸 최적의 벡터값이 된다.

## 소프트 토큰은 태스크 고정값이다
입력마다 달라지는 게 아니라, 모든 입력에 동일한 prefix가 붙는다.

```
Task: 감성 분류
입력 1: [v1][v2][v3] + "이 영화 재밌었어요"
입력 2: [v1][v2][v3] + "별로였습니다"
입력 3: [v1][v2][v3] + "그냥 그랬어요"
← v1, v2, v3는 세 입력 모두에서 동일
```

학습이 끝나면 v1~v3에 "이 태스크는 감성 분류다"가 인코딩된 상태가 된다.

## LoRA와의 개입 위치 비교
```
입력 x → [Prompt Tuning 개입: prefix 주입]
          ↓
         W  →  [LoRA 개입: B×A 병렬 추가]
          ↓
         출력
```

LoRA는 W의 행동을 바꾸고, Prompt Tuning은 W가 보는 컨텍스트를 바꾼다. 모델 가중치 접근 없이 API만 있어도 쓸 수 있는 이유가 여기 있다.

## Related
- [[PEFT method selection depends on model access level and structural constraints]] — Prompt Tuning이 속한 PEFT 분류 허브
- [[LoRA - Low-Rank Adaptation]] — 개입 위치가 다른 PEFT 기법 비교

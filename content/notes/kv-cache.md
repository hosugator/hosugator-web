---
created: 2026-05-13
updated: 2026-05-13 14:04
subject: "[[AI]]"
project: "[[rebellions - fde]]"
type: study
status: 2-stable
tags:
  - kv-cache
  - llm-inference
  - attention
  - memory-optimization
publish: true
---
## 1. 개념

KV 캐시는 Transformer의 Autoregressive 추론 과정에서 발생하는 중복 연산을 제거하기 위한 최적화 기법이다. Attention 수식 자체에 내장된 것이 아니라, 추론 단계에서 공학적으로 추가되는 레이어다.

## 2. 왜 필요한가 (Autoregressive 생성)

LLM은 토큰을 **한 번에 하나씩** 생성한다. 토큰 N+1을 생성하려면 토큰 1~N 전체에 대한 Attention 연산이 필요하다.

```
KV 캐시 없음:
  토큰3 생성 시 → "AI란", "무엇", "인가" K,V 전부 재계산
  토큰4 생성 시 → "AI란", "무엇", "인가", "?" K,V 전부 재계산  ← 앞 세 개 또 계산

KV 캐시 있음:
  토큰1 생성 후 → K1, V1 저장
  토큰2 생성 후 → K2, V2 저장  (K1, V1 재사용)
  토큰3 생성 시 → K3, V3만 신규 계산  (K1, V1, K2, V2 꺼내서 씀)
```

## 3. 재사용이 가능한 이유

```
K_i = embedding_i × Wk
V_i = embedding_i × Wv
```

토큰 i의 K, V는 **자신의 임베딩에서만** 결정된다. Causal Attention(단방향, GPT 계열)에서는 미래 토큰이 과거 토큰의 임베딩에 영향을 주지 않으므로, 한 번 계산한 K, V는 이후 스텝에서도 변하지 않는다.

> BERT(양방향 Attention)에서는 불가 — 새 토큰 추가 시 기존 토큰의 맥락이 바뀌어 K, V도 재계산이 필요하다.

## 4. Q는 매번 새로 계산

캐시하는 것과 하지 않는 것의 구분:

```
캐시 O: K, V  → 토큰 자체 특성, 고정
캐시 X: Q × K → 관계 점수, 새 토큰마다 새로 계산
```

K는 재사용하지만, 새 토큰의 Q와 곱해지는 순간 새로운 관계가 만들어진다. 관계성이 무시되는 게 아니다.

## 5. KV 캐시 vs Prefix Caching

| | KV 캐시 | Prefix Caching |
|---|---|---|
| 범위 | 단일 요청 내 | 요청 간 |
| 대상 | 생성 중 누적되는 모든 K, V | 공통 prefix(시스템 프롬프트 등)의 K, V |
| 조건 | 항상 작동 | 공통 prefix가 있을 때만 |
| 구현 | 기본 내장 | 별도 최적화 (vLLM 지원) |

## 6. VRAM 점유

생성 토큰 수에 비례하여 K, V 행렬이 누적되므로 VRAM을 점진적으로 점유한다. 여러 요청을 동시에 처리할수록 VRAM 압박이 커진다.

→ 이 VRAM 관리 문제를 해결하는 것이 [[vLLM-PagedAttention|PagedAttention]]

## 연결

- [[self-attention]] — K, V가 생성되는 원리 (Q/K/V 메커니즘)
- [[vLLM-PagedAttention]] — KV 캐시의 VRAM 관리 최적화
- [[Attention 개념 정리]] — 탐색 허브
